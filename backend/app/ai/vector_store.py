"""Local Vector Database Engine for Grounded Statutory RAG.

Utilizes ChromaDB with pre-indexed official government manuals, circulars,
and statutory guidelines. Provides semantic similarity retrieval and rich
metadata tracking for citation compliance and zero-hallucination guardrails.
"""

from __future__ import annotations
import os
import re
import math
from typing import List, Dict, Any, Optional
try:
    import chromadb
    from chromadb.config import Settings as ChromaSettings
    HAS_CHROMADB = True
except ImportError:
    chromadb = None
    ChromaSettings = None
    HAS_CHROMADB = False

from app.config import settings
from app.data.knowledge_base import OFFICIAL_KNOWLEDGE_DOCUMENTS
from app.data.blueprints import MASTER_BLUEPRINTS, MASTER_HIERARCHICAL_JOURNEYS
import logging

logger = logging.getLogger(__name__)


class PassageChunk:
    """Represents a chunk of official statutory text with metadata."""
    def __init__(
        self,
        chunk_id: str,
        text: str,
        department: str,
        document_title: str,
        section_title: str,
        portal_url: str,
        domain: str,
        source_reference: str,
    ):
        self.chunk_id = chunk_id
        self.text = text
        self.department = department
        self.document_title = document_title
        self.section_title = section_title
        self.portal_url = portal_url
        self.domain = domain
        self.source_reference = source_reference

    def to_metadata(self) -> Dict[str, Any]:
        return {
            "department": self.department,
            "document_title": self.document_title,
            "section_title": self.section_title,
            "portal_url": self.portal_url,
            "domain": self.domain,
            "source_reference": self.source_reference,
        }


class StatutoryVectorStore:
    """Manages the local ChromaDB vector store of official government manuals."""

    def __init__(self, persist_directory: Optional[str] = None):
        self.persist_directory = persist_directory or settings.VECTOR_DB_DIR
        self._chunks: List[PassageChunk] = []
        self._collection = None
        self._journey_collection = None
        self._init_db()

    def _init_db(self) -> None:
        """Initialize ChromaDB client and build collection from official docs."""
        if HAS_CHROMADB and chromadb is not None:
            try:
                os.makedirs(self.persist_directory, exist_ok=True)
                self._client = chromadb.PersistentClient(
                    path=self.persist_directory,
                    settings=ChromaSettings(anonymized_telemetry=False)
                )
            except Exception:
                # Fallback to EphemeralClient in constrained/in-memory environments
                try:
                    self._client = chromadb.EphemeralClient(
                        settings=ChromaSettings(anonymized_telemetry=False)
                    )
                except Exception:
                    self._client = None

            if self._client:
                collection_name = "official_statutory_manuals"
                try:
                    self._collection = self._client.get_or_create_collection(
                        name=collection_name,
                        metadata={"description": "Verified Official Government Statutory Source Documents"}
                    )
                except Exception:
                    try:
                        self._collection = self._client.create_collection(name=collection_name)
                    except Exception:
                        self._collection = None

                # Journey blueprints collection for semantic journey discovery
                try:
                    self._journey_collection = self._client.get_or_create_collection(
                        name="journey_blueprints",
                        metadata={"description": "Semantic index of statutory life-event journey blueprints"}
                    )
                except Exception:
                    try:
                        self._journey_collection = self._client.create_collection(name="journey_blueprints")
                    except Exception:
                        self._journey_collection = None
        else:
            self._client = None
            self._collection = None
            self._journey_collection = None

        # Build chunks from knowledge base for in-memory & chroma indexing
        self._build_and_index_chunks()
        # Build journey blueprint index
        self._build_journey_index()

    def _build_and_index_chunks(self) -> None:
        """Extract and index all sections from official knowledge documents."""
        self._chunks.clear()
        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for doc in OFFICIAL_KNOWLEDGE_DOCUMENTS:
            doc_id = doc["doc_id"]
            department = doc["department"]
            title = doc["title"]
            domain = doc.get("domain", "GENERAL")
            source_ref = doc["source_reference"]
            portal_url = doc["official_portal_url"]

            for sec in doc.get("sections", []):
                sec_id = sec["section_id"]
                sec_title = sec["section_title"]
                sec_content = sec["content"]

                chunk_id = f"{doc_id}#{sec_id}"
                combined_text = f"[{department}] {title} — {sec_title}: {sec_content}"

                chunk = PassageChunk(
                    chunk_id=chunk_id,
                    text=sec_content,
                    department=department,
                    document_title=title,
                    section_title=sec_title,
                    portal_url=portal_url,
                    domain=domain,
                    source_reference=source_ref,
                )
                self._chunks.append(chunk)

                ids.append(chunk_id)
                documents.append(combined_text)
                metadatas.append(chunk.to_metadata())

        if ids and self._collection is not None:
            try:
                self._collection.upsert(
                    ids=ids,
                    documents=documents,
                    metadatas=metadatas
                )
                logger.info(f"Indexed {len(ids)} statutory chunks into ChromaDB")
            except Exception as e:
                logger.warning(f"Failed to upsert chunks into ChromaDB: {e}")

    def search_similar(
        self,
        query: str,
        domain_filter: Optional[str] = None,
        top_k: int = 3,
        step_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Hybrid search: semantic similarity retrieval + lexical scoring."""
        if not query or not query.strip():
            return []

        results: List[Dict[str, Any]] = []
        chroma_hits: List[Dict[str, Any]] = []

        if self._collection is not None:
            try:
                where_filter = {"domain": domain_filter} if domain_filter else None
                query_res = self._collection.query(
                    query_texts=[query],
                    n_results=min(top_k * 2, max(1, self._collection.count())),
                    where=where_filter,
                )
                if query_res and "ids" in query_res and query_res["ids"] and len(query_res["ids"][0]) > 0:
                    hit_ids = query_res["ids"][0]
                    hit_metas = query_res["metadatas"][0] if "metadatas" in query_res else []
                    hit_docs = query_res["documents"][0] if "documents" in query_res else []
                    hit_distances = query_res["distances"][0] if "distances" in query_res and query_res["distances"] else [0.0] * len(hit_ids)

                    for idx, cid in enumerate(hit_ids):
                        meta = hit_metas[idx] if idx < len(hit_metas) else {}
                        doc_text = hit_docs[idx] if idx < len(hit_docs) else ""
                        dist = hit_distances[idx] if idx < len(hit_distances) else 1.0
                        score = 1.0 / (1.0 + float(dist)) if dist is not None else 0.8

                        # Extract original pure text
                        pure_text = doc_text
                        if ":" in pure_text:
                            pure_text = pure_text.split(":", 1)[1].strip()

                        chroma_hits.append({
                            "chunk_id": cid,
                            "text": pure_text,
                            "score": round(score, 4),
                            "department": meta.get("department", "Government of India"),
                            "document_title": meta.get("document_title", ""),
                            "section_title": meta.get("section_title", ""),
                            "portal_url": meta.get("portal_url", ""),
                            "domain": meta.get("domain", "GENERAL"),
                            "source_reference": meta.get("source_reference", ""),
                        })
            except Exception as e:
                logger.warning(f"ChromaDB semantic search error: {e}")

        # Lexical scoring with exact match bonus
        q_tokens = set(re.findall(r"\w+", query.lower()))
        if step_id:
            q_tokens.update(re.findall(r"\w+", step_id.lower().replace("-", " ")))

        lexical_hits: List[Dict[str, Any]] = []
        for chunk in self._chunks:
            if domain_filter and chunk.domain != domain_filter:
                continue

            chunk_text_lower = (
                f"{chunk.department} {chunk.document_title} {chunk.section_title} {chunk.text} {chunk.domain}"
            ).lower()

            match_count = sum(1 for t in q_tokens if len(t) > 2 and t in chunk_text_lower)
            exact_bonus = 1.5 if any(len(t) > 4 and t in chunk_text_lower for t in q_tokens) else 0.0

            if match_count > 0:
                score = (match_count * 1.0 + exact_bonus) / (len(q_tokens) + 1.0)
                lexical_hits.append({
                    "chunk_id": chunk.chunk_id,
                    "text": chunk.text,
                    "score": round(score, 4),
                    "department": chunk.department,
                    "document_title": chunk.document_title,
                    "section_title": chunk.section_title,
                    "portal_url": chunk.portal_url,
                    "domain": chunk.domain,
                    "source_reference": chunk.source_reference,
                })

        combined_dict: Dict[str, Dict[str, Any]] = {}
        for hit in chroma_hits:
            combined_dict[hit["chunk_id"]] = hit

        for hit in lexical_hits:
            cid = hit["chunk_id"]
            if cid in combined_dict:
                combined_dict[cid]["score"] = max(combined_dict[cid]["score"], hit["score"] + 0.2)
            else:
                combined_dict[cid] = hit

        sorted_results = sorted(combined_dict.values(), key=lambda x: x["score"], reverse=True)
        if not sorted_results and self._chunks:
            return [
                {
                    "chunk_id": c.chunk_id,
                    "text": c.text,
                    "score": 0.5,
                    "department": c.department,
                    "document_title": c.document_title,
                    "section_title": c.section_title,
                    "portal_url": c.portal_url,
                    "domain": c.domain,
                    "source_reference": c.source_reference,
                }
                for c in self._chunks[:top_k]
            ]
        return sorted_results[:top_k]

    def search(
        self,
        query: str,
        top_k: int = 3,
        domain_filter: Optional[str] = None,
        step_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Alias for search_similar with backward-compatible signature."""
        return self.search_similar(query=query, domain_filter=domain_filter, top_k=top_k, step_id=step_id)

    def _build_journey_index(self) -> None:
        """Index all MASTER_BLUEPRINTS and MASTER_HIERARCHICAL_JOURNEYS into ChromaDB."""
        if self._journey_collection is None:
            return

        seen_ids: set = set()
        ids: List[str] = []
        documents: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        # 1. Standard Blueprints
        for jid, bp in MASTER_BLUEPRINTS.items():
            canonical_id = bp.get("journey_id", jid)
            if canonical_id in seen_ids:
                continue
            seen_ids.add(canonical_id)

            title = bp.get("title", "")
            description = bp.get("description", "")
            category = bp.get("category", "")
            department = bp.get("department", "")
            jurisdiction = bp.get("jurisdiction", "")
            state = bp.get("state", "National")

            step_titles = " | ".join(node.get("title", "") for node in bp.get("nodes", []))
            combined_text = (
                f"{title}. {description}. Category: {category}. "
                f"Department: {department}. Jurisdiction: {jurisdiction}. "
                f"State: {state}. Steps: {step_titles}"
            )

            ids.append(canonical_id)
            documents.append(combined_text)
            metadatas.append({
                "journey_id": canonical_id,
                "title": title,
                "description": description[:300],
                "category": category,
                "department": department,
                "jurisdiction": jurisdiction,
                "state": state,
                "estimated_duration": bp.get("estimated_duration", ""),
            })

        # 2. Hierarchical Journeys
        for hj_id, hj in MASTER_HIERARCHICAL_JOURNEYS.items():
            canonical_id = hj.journey_id
            if canonical_id in seen_ids:
                continue
            seen_ids.add(canonical_id)

            step_titles = " | ".join(node.title for node in hj.nodes)
            substep_titles = " | ".join(sub.title for node in hj.nodes for sub in node.substeps)
            combined_text = (
                f"{hj.title}. {hj.description}. Category: {hj.category}. "
                f"Department: {hj.department}. Jurisdiction: {hj.jurisdiction}. "
                f"State: {hj.state}. Nodes: {step_titles}. Substeps: {substep_titles}"
            )

            ids.append(canonical_id)
            documents.append(combined_text)
            metadatas.append({
                "journey_id": canonical_id,
                "title": hj.title,
                "description": hj.description[:300],
                "category": hj.category,
                "department": hj.department,
                "jurisdiction": hj.jurisdiction,
                "state": hj.state or "National",
                "estimated_duration": hj.estimated_duration,
            })

        if ids:
            try:
                current_count = self._journey_collection.count()
                if current_count < len(ids):
                    self._journey_collection.upsert(
                        ids=ids,
                        documents=documents,
                        metadatas=metadatas
                    )
                    logger.info(f"Indexed {len(ids)} journey blueprints into ChromaDB")
            except Exception as e:
                logger.warning(f"Failed to index journey blueprints: {e}")

    def search_journeys(
        self,
        query: str,
        top_k: int = 5,
    ) -> List[Dict[str, Any]]:
        """Semantic search over journey blueprints. Returns scored matches.

        Each result contains: journey_id, title, description, category, department, jurisdiction, state, score.
        """
        if not query or not query.strip():
            return []

        results: List[Dict[str, Any]] = []

        # 1. ChromaDB semantic search
        if self._journey_collection is not None:
            try:
                query_res = self._journey_collection.query(
                    query_texts=[query],
                    n_results=min(top_k, max(1, self._journey_collection.count())),
                )
                if query_res and "ids" in query_res and query_res["ids"] and len(query_res["ids"][0]) > 0:
                    hit_ids = query_res["ids"][0]
                    hit_metas = query_res["metadatas"][0] if "metadatas" in query_res else []
                    hit_distances = (
                        query_res["distances"][0]
                        if "distances" in query_res and query_res["distances"]
                        else [0.0] * len(hit_ids)
                    )

                    for idx, jid in enumerate(hit_ids):
                        meta = hit_metas[idx] if idx < len(hit_metas) else {}
                        dist = hit_distances[idx] if idx < len(hit_distances) else 1.0
                        score = 1.0 / (1.0 + float(dist)) if dist is not None else 0.5
                        results.append({
                            "journey_id": jid,
                            "title": meta.get("title", ""),
                            "description": meta.get("description", ""),
                            "category": meta.get("category", ""),
                            "department": meta.get("department", ""),
                            "jurisdiction": meta.get("jurisdiction", "Central / National"),
                            "state": meta.get("state", "National"),
                            "estimated_duration": meta.get("estimated_duration", ""),
                            "score": round(score, 4),
                        })
            except Exception as e:
                logger.warning(f"Journey vector search error: {e}")

        # 2. Lexical keyword fallback over MASTER_BLUEPRINTS & MASTER_HIERARCHICAL_JOURNEYS
        q_tokens = set(query.lower().split())
        seen_jids = {r["journey_id"] for r in results}
        seen_canonical: set = set()

        all_sources = list(MASTER_BLUEPRINTS.values()) + list(MASTER_HIERARCHICAL_JOURNEYS.values())
        for bp in all_sources:
            if isinstance(bp, dict):
                canonical_id = bp.get("journey_id")
                title = bp.get("title", "")
                desc = bp.get("description", "")
                cat = bp.get("category", "")
                dept = bp.get("department", "")
                jur = bp.get("jurisdiction", "Central / National")
                st = bp.get("state", "National")
                dur = bp.get("estimated_duration", "")
            else:
                canonical_id = getattr(bp, "journey_id", None)
                title = getattr(bp, "title", "")
                desc = getattr(bp, "description", "")
                cat = getattr(bp, "category", "")
                dept = getattr(bp, "department", "")
                jur = getattr(bp, "jurisdiction", "Central / National")
                st = getattr(bp, "state", "National")
                dur = getattr(bp, "estimated_duration", "")

            if not canonical_id or canonical_id in seen_jids or canonical_id in seen_canonical:
                continue
            seen_canonical.add(canonical_id)

            searchable = f"{title} {desc} {cat} {dept} {jur} {st}".lower()
            match_count = sum(1 for t in q_tokens if len(t) > 2 and t in searchable)
            if match_count > 0:
                score = match_count / (len(q_tokens) + 1.0)
                results.append({
                    "journey_id": canonical_id,
                    "title": title,
                    "description": desc[:300] if desc else "",
                    "category": cat,
                    "department": dept,
                    "jurisdiction": jur,
                    "state": st,
                    "estimated_duration": dur,
                    "score": round(score, 4),
                })

        # Sort by score descending and return top_k
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def list_sources(self) -> List[Dict[str, Any]]:
        """Return structured summary of all 15 indexed official government sources."""
        sources = []
        for doc in OFFICIAL_KNOWLEDGE_DOCUMENTS:
            sources.append({
                "doc_id": doc["doc_id"],
                "title": doc["title"],
                "department": doc["department"],
                "jurisdiction": doc["jurisdiction"],
                "official_portal_url": doc["official_portal_url"],
                "section_count": len(doc.get("sections", [])),
                "source_reference": doc["source_reference"],
                "domain": doc.get("domain", "GENERAL"),
            })
        return sources


# Global singleton instance
vector_store = StatutoryVectorStore()
