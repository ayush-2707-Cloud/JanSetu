"""
Deterministic Sequential & DAG Dependency Resolution Engine.
Enforces strict sequential unlocking: Step N+1 cannot be unlocked or completed
until all prerequisite steps {Step 1 ... Step N} are fully verified/completed.
Supports both flat Node Blueprints and Hierarchical Workflow State Machine (Node -> SubStep).
"""

from typing import List, Set, Tuple, Optional, Dict
from datetime import datetime, timezone
from app.schemas.journey import (
    JourneyBlueprint,
    NodeBlueprint,
    NodeRuntimeState,
    JourneyRuntimeEvaluation,
    StepStatus,
    Journey,
    Node,
    SubStep,
)


class DependencyResolutionError(Exception):
    """Raised when a sequential or prerequisite dependency rule is violated."""
    def __init__(self, message: str, step_id: str, missing_prerequisites: List[str]):
        super().__init__(message)
        self.step_id = step_id
        self.missing_prerequisites = missing_prerequisites


class DependencyEngine:
    """
    Evaluates statutory journey states against user progress.
    Guarantees strict sequential dependency locking and progress computation.
    """

    # ─────────────────────────────────────────────────────────────────────────
    # Hierarchical State Machine (Journey -> Node -> SubStep)
    # ─────────────────────────────────────────────────────────────────────────

    @classmethod
    def evaluate_hierarchical_journey(
        cls,
        journey: Journey,
        completed_substep_ids: List[str],
    ) -> Journey:
        """
        Evaluate a hierarchical journey with nested SubSteps and calculate:
        - Substep statuses (COMPLETED, IN_PROGRESS, LOCKED)
        - Node progress percentage based on completed mandatory substeps
        - Node status (COMPLETED when all mandatory substeps are done, unlocking downstream nodes)
        - Journey overall progress percentage
        """
        completed_sub_set: Set[str] = set(completed_substep_ids)
        completed_node_ids: Set[str] = set()

        evaluated_nodes: List[Node] = []
        first_in_progress_node_id: Optional[str] = None

        # Deep clone nodes for runtime evaluation
        raw_nodes = [n.model_copy(deep=True) for n in journey.nodes]

        for node in raw_nodes:
            # Check DAG prerequisites: all prerequisite node IDs must be in completed_node_ids
            missing_prereqs = [p for p in node.prerequisites if p not in completed_node_ids]
            is_unlocked = len(missing_prereqs) == 0

            # Evaluate child substeps
            first_uncompleted_substep_found = False
            evaluated_substeps: List[SubStep] = []

            for sub in node.substeps:
                sub_copy = sub.model_copy()
                if sub.substep_id in completed_sub_set:
                    sub_copy.status = StepStatus.COMPLETED
                    sub_copy.completed_at = sub.completed_at or datetime.now(timezone.utc).strftime("%Y-%m-%d")
                elif not is_unlocked:
                    sub_copy.status = StepStatus.LOCKED
                else:
                    if not first_uncompleted_substep_found:
                        sub_copy.status = StepStatus.IN_PROGRESS
                        first_uncompleted_substep_found = True
                    else:
                        sub_copy.status = StepStatus.LOCKED
                evaluated_substeps.append(sub_copy)

            node.substeps = evaluated_substeps

            # Calculate Node progress percentage based on mandatory substeps
            mandatory_subs = [s for s in evaluated_substeps if s.is_mandatory]
            total_mandatory = len(mandatory_subs)
            completed_mandatory = len([s for s in mandatory_subs if s.status == StepStatus.COMPLETED])

            if total_mandatory > 0:
                node_progress = int((completed_mandatory / total_mandatory) * 100)
            elif len(evaluated_substeps) > 0:
                # If no mandatory flag explicitly set, all substeps count
                completed_all = len([s for s in evaluated_substeps if s.status == StepStatus.COMPLETED])
                node_progress = int((completed_all / len(evaluated_substeps)) * 100)
            else:
                node_progress = 100 if node.node_id in completed_sub_set else 0

            node.progress_percentage = node_progress
            node.is_unlocked = is_unlocked
            node.missing_prerequisites = missing_prereqs

            # Determine Node Status & Unlocking
            if not is_unlocked:
                node.status = StepStatus.LOCKED
            elif node_progress == 100:
                node.status = StepStatus.COMPLETED
                node.completed_at = node.completed_at or datetime.now(timezone.utc).strftime("%Y-%m-%d")
                completed_node_ids.add(node.node_id)
            else:
                node.status = StepStatus.IN_PROGRESS
                if not first_in_progress_node_id:
                    first_in_progress_node_id = node.node_id

            evaluated_nodes.append(node)

        # Calculate Journey-level summary metrics
        total_nodes = len(evaluated_nodes)
        completed_nodes = len([n for n in evaluated_nodes if n.status == StepStatus.COMPLETED])

        # Precise overall progress weighted across all mandatory substeps in the journey
        all_mandatory_subs = [s for n in evaluated_nodes for s in n.substeps if s.is_mandatory]
        if all_mandatory_subs:
            all_completed_subs = [s for s in all_mandatory_subs if s.status == StepStatus.COMPLETED]
            overall_progress = int((len(all_completed_subs) / len(all_mandatory_subs)) * 100)
        elif total_nodes > 0:
            overall_progress = int((completed_nodes / total_nodes) * 100)
        else:
            overall_progress = 0

        updated_journey = journey.model_copy()
        updated_journey.nodes = evaluated_nodes
        updated_journey.completed_nodes_count = completed_nodes
        updated_journey.total_nodes_count = total_nodes
        updated_journey.overall_progress_percentage = overall_progress
        updated_journey.current_active_node_id = first_in_progress_node_id

        return updated_journey

    @classmethod
    def complete_substep(
        cls,
        journey: Journey,
        node_id: str,
        substep_id: str,
        completed_substep_ids: List[str],
    ) -> Tuple[List[str], Journey, bool, List[str]]:
        """
        Complete a specific substep within a journey:
        - Validates the parent node is currently unlocked.
        - Validates the substep exists.
        - Appends substep_id to completed list.
        - Recalculates hierarchical state.
        - Detects if parent node was completed and identifies any newly unlocked downstream nodes.
        """
        node_map = {n.node_id: n for n in journey.nodes}
        if node_id not in node_map:
            raise KeyError(f"Node '{node_id}' not found in journey '{journey.journey_id}'.")

        target_node = node_map[node_id]

        # Check if parent node is currently locked before substep completion
        initial_evaluation = cls.evaluate_hierarchical_journey(journey, completed_substep_ids)
        eval_node_map = {n.node_id: n for n in initial_evaluation.nodes}
        current_eval_node = eval_node_map.get(node_id)

        if not current_eval_node or not current_eval_node.is_unlocked:
            missing = current_eval_node.missing_prerequisites if current_eval_node else target_node.prerequisites
            missing_titles = [node_map[p].title for p in missing if p in node_map]
            raise DependencyResolutionError(
                message=(
                    f"Cannot complete substep '{substep_id}' in node '{target_node.title}'. "
                    f"Prerequisite milestone node(s) not completed: {', '.join(missing_titles)}."
                ),
                step_id=node_id,
                missing_prerequisites=missing,
            )

        # Verify substep exists in target node
        sub_map = {s.substep_id: s for s in target_node.substeps}
        if substep_id not in sub_map:
            raise KeyError(f"Substep '{substep_id}' does not exist in node '{node_id}'.")

        # Snapshot currently unlocked nodes before completion
        previously_unlocked_nodes = {n.node_id for n in initial_evaluation.nodes if n.is_unlocked}

        # Add substep to completed list
        updated_substeps = list(completed_substep_ids)
        if substep_id not in updated_substeps:
            updated_substeps.append(substep_id)

        # Re-evaluate journey
        updated_journey = cls.evaluate_hierarchical_journey(journey, updated_substeps)

        # Check if target node became COMPLETED
        updated_node_map = {n.node_id: n for n in updated_journey.nodes}
        node_now_completed = updated_node_map[node_id].status == StepStatus.COMPLETED

        # Find newly unlocked downstream nodes
        now_unlocked_nodes = {n.node_id for n in updated_journey.nodes if n.is_unlocked}
        newly_unlocked = list(now_unlocked_nodes - previously_unlocked_nodes)

        return updated_substeps, updated_journey, node_now_completed, newly_unlocked

    # ─────────────────────────────────────────────────────────────────────────
    # Flat Blueprint Engine (Backward Compatibility)
    # ─────────────────────────────────────────────────────────────────────────

    @staticmethod
    def evaluate_journey(
        blueprint: JourneyBlueprint,
        completed_step_ids: List[str],
        active_step_override: Optional[str] = None
    ) -> JourneyRuntimeEvaluation:
        """
        Evaluate all nodes in a flat blueprint against a set of completed step IDs.
        """
        completed_set: Set[str] = set(completed_step_ids)
        evaluated_nodes: List[NodeRuntimeState] = []
        first_uncompleted_found = False
        current_active_id: Optional[str] = None

        for node in blueprint.nodes:
            missing_prereqs = [p for p in node.prerequisites if p not in completed_set]
            is_unlocked = len(missing_prereqs) == 0

            if node.step_id in completed_set:
                status = StepStatus.COMPLETED
                runtime_node = NodeRuntimeState(
                    **node.model_dump(),
                    status=status,
                    is_unlocked=True,
                    missing_prerequisites=[],
                    completed_at=datetime.now(timezone.utc).strftime("%Y-%m-%d")
                )
            elif is_unlocked:
                if not first_uncompleted_found:
                    status = StepStatus.IN_PROGRESS
                    first_uncompleted_found = True
                    current_active_id = node.step_id
                else:
                    status = StepStatus.IN_PROGRESS if node.step_id == active_step_override else StepStatus.IN_PROGRESS
                
                runtime_node = NodeRuntimeState(
                    **node.model_dump(),
                    status=status,
                    is_unlocked=True,
                    missing_prerequisites=[]
                )
            else:
                status = StepStatus.LOCKED
                runtime_node = NodeRuntimeState(
                    **node.model_dump(),
                    status=status,
                    is_unlocked=False,
                    missing_prerequisites=missing_prereqs
                )

            evaluated_nodes.append(runtime_node)

        total_count = len(evaluated_nodes)
        completed_count = len([n for n in evaluated_nodes if n.status == StepStatus.COMPLETED])
        overall_progress = int((completed_count / total_count) * 100) if total_count > 0 else 0

        return JourneyRuntimeEvaluation(
            journey_id=blueprint.journey_id,
            title=blueprint.title,
            category=blueprint.category,
            jurisdiction=blueprint.jurisdiction,
            department=blueprint.department,
            description=blueprint.description,
            estimated_duration=blueprint.estimated_duration,
            domain_id=blueprint.domain_id,
            subcategory_id=blueprint.subcategory_id,
            activity_id=blueprint.activity_id,
            overall_progress_percentage=overall_progress,
            completed_steps_count=completed_count,
            total_steps_count=total_count,
            current_active_step_id=current_active_id,
            nodes=evaluated_nodes,
        )

    @classmethod
    def validate_and_complete_step(
        cls,
        blueprint: JourneyBlueprint,
        completed_step_ids: List[str],
        target_step_id: str,
    ) -> Tuple[List[str], JourneyRuntimeEvaluation]:
        """
        Attempt to complete a target step in a flat blueprint.
        """
        node_map = {n.step_id: n for n in blueprint.nodes}
        if target_step_id not in node_map:
            raise KeyError(f"Step '{target_step_id}' does not exist in journey '{blueprint.journey_id}'.")

        target_node = node_map[target_step_id]
        completed_set = set(completed_step_ids)

        missing_prereqs = [p for p in target_node.prerequisites if p not in completed_set]
        if missing_prereqs:
            missing_titles = [node_map[p].title for p in missing_prereqs if p in node_map]
            raise DependencyResolutionError(
                message=(
                    f"Cannot unlock/complete '{target_node.title}' (Step {target_node.step_number}). "
                    f"You must first complete the preceding prerequisite milestone(s): {', '.join(missing_titles)}."
                ),
                step_id=target_step_id,
                missing_prerequisites=missing_prereqs,
            )

        updated_completed = list(completed_step_ids)
        if target_step_id not in updated_completed:
            updated_completed.append(target_step_id)

        evaluated_journey = cls.evaluate_journey(blueprint, updated_completed)
        return updated_completed, evaluated_journey
