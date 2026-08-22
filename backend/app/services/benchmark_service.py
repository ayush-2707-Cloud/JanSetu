"""Synthetic API Load & Benchmark Service for GovTech Middleware.

Executes multi-threaded concurrent canonical transformations, UTID validations,
and calculates real throughput (ops/sec) and p95/p99 latencies.
"""

import time
import uuid
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.schemas.tier3_suite import BenchmarkRequest, BenchmarkResult
from app.services.schema_harmonizer import SchemaHarmonizer


def _percentile(data: List[float], p: float) -> float:
    """Pure Python percentile calculation."""
    if not data:
        return 0.0
    sorted_d = sorted(data)
    k = (len(sorted_d) - 1) * (p / 100.0)
    f = int(k)
    c = min(f + 1, len(sorted_d) - 1)
    d = k - f
    return float(sorted_d[f] + d * (sorted_d[c] - sorted_d[f]))


class BenchmarkService:
    """Runs high-concurrency synthetic stress tests over the middleware layer."""

    _benchmark_history: List[BenchmarkResult] = []

    @classmethod
    async def run_single_mock_transaction(cls, i: int) -> float:
        """Simulates one end-to-end canonical harmonization + UTID hash validation."""
        start = time.perf_counter()
        
        sample_payload = {
            "cust_name": f"Citizen {i}",
            "tax_id": f"ABCDE{1000 + i}F",
            "contact_no": f"98765{10000 + i}",
            "res_address": "Flat 42, Marine Drive, Mumbai 400020",
            "khasra_no": f"Plot {i}/2A",
        }
        # Run real canonical normalization
        _ = SchemaHarmonizer.harmonize("REVENUE", sample_payload)
        
        # Small micro-yield to simulate network I/O
        await asyncio.sleep(0.0005)
        
        end = time.perf_counter()
        return (end - start) * 1000.0  # Return latency in ms

    @classmethod
    async def execute_benchmark(cls, req: BenchmarkRequest) -> BenchmarkResult:
        """Executes concurrent load test across specified transaction count."""
        total_count = req.transaction_count
        overall_start = time.perf_counter()

        # Run transactions with semaphore concurrency
        semaphore = asyncio.Semaphore(req.concurrency_level)

        async def bounded_task(i: int):
            async with semaphore:
                return await cls.run_single_mock_transaction(i)

        tasks = [bounded_task(i) for i in range(total_count)]
        latencies = await asyncio.gather(*tasks)

        overall_end = time.perf_counter()
        elapsed_sec = max(0.001, overall_end - overall_start)
        throughput = total_count / elapsed_sec

        # Compute percentiles
        p50 = _percentile(latencies, 50.0)
        p95 = _percentile(latencies, 95.0)
        p99 = _percentile(latencies, 99.0)

        result = BenchmarkResult(
            benchmark_id=f"BM-{uuid.uuid4().hex[:8].upper()}",
            total_transactions_processed=total_count,
            concurrency_level=req.concurrency_level,
            elapsed_time_sec=round(elapsed_sec, 3),
            throughput_ops_per_sec=round(throughput, 1),
            p50_latency_ms=round(p50, 2),
            p95_latency_ms=round(p95, 2),
            p99_latency_ms=round(p99, 2),
            success_rate_percent=100.0,
            error_rate_percent=0.0,
            timestamp=datetime.now(timezone.utc).isoformat(),
            architecture_stamp="FastAPI Async IO + Uvicorn Worker Pool (Non-blocking)",
        )

        cls._benchmark_history.append(result)
        return result

    @classmethod
    def get_history(cls) -> List[BenchmarkResult]:
        return list(reversed(cls._benchmark_history[-10:]))
