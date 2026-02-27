---
title: "Benchmarking TunnelMesh"
date: 2026-01-12
author: TunnelMesh Team
excerpt: How does TunnelMesh actually perform? We look at throughput, latency, and CPU overhead across transport modes and hardware, methodology included so you can reproduce the results.
---

# Benchmarking TunnelMesh

Performance questions come up a lot: How much overhead does the encryption add? What's the throughput difference between direct UDP and WebSocket relay? How does it hold up on a Raspberry Pi?

TunnelMesh ships with benchmarking tools that run inside the mesh itself, so the numbers reflect your actual hardware and network, not a synthetic lab.

## The Tools

Three components, each suited to different use cases:

**`tunnelmesh benchmark`**: the CLI tool. Quick on-demand tests between specific peers. Good for spot-checking.

**`tunnelmesh-benchmarker`**: a Docker service for continuous benchmarking. Runs multiple simultaneous transfers, logs to Prometheus, shows trends in Grafana. Good for regression testing.

**`tunnelmesh-s3bench`**: stress tests the S3 storage backend specifically, with concurrent workloads and adversarial scenarios.

## Running a Quick Benchmark

```bash
# 10-second throughput and latency test to a peer
tunnelmesh benchmark --peer my-server

# Longer test
tunnelmesh benchmark --peer my-server --duration 60s
```

Output is JSON, which makes it easy to save and compare over time:

```json
{
  "peer": "my-server",
  "transport": "direct",
  "duration_s": 10,
  "tx_mbps": 312.4,
  "rx_mbps": 308.1,
  "latency_avg_ms": 1.2,
  "latency_p99_ms": 3.1,
  "packet_loss_pct": 0.0
}
```

## Simulating Real-World Conditions

A clean local network doesn't tell you how your application will behave over a mobile connection or a flaky cloud link. The chaos flags inject realistic conditions:

```bash
# Lossy WiFi (2% packet loss, 20ms latency)
tunnelmesh benchmark --peer my-server --loss 2 --latency 20 --jitter 5

# Mobile 4G (50ms latency, 10Mbps cap)
tunnelmesh benchmark --peer my-server --latency 50 --jitter 15 --bandwidth 10

# Satellite link
tunnelmesh benchmark --peer my-server --latency 600 --jitter 50 --loss 5 --bandwidth 5
```

The `--jitter` flag adds random variation to the simulated latency, which surfaces problems that average-latency numbers hide, like retry storms and timeout cascades.

## Continuous Benchmarking

For ongoing monitoring, add the benchmarker service to your Compose stack:

```bash
docker compose --profile benchmark up benchmarker
```

It runs 3–6 simultaneous transfers continuously. Results flow into Prometheus and show up in the pre-configured Grafana dashboards. A throughput regression shows up immediately rather than being discovered in production.

## What to Look For

**Throughput on direct UDP** is your baseline. If it's significantly lower than your raw network capacity, the bottleneck is likely CPU; ChaCha20 encryption is CPU-bound, and a busy node will throttle throughput before the network does.

**p99 latency under chaos** is more predictive of real-world application behaviour than average throughput on a clean link. Test with `--loss 2` (2% packet loss is typical of a mediocre WiFi connection) and watch the p99.

**Transport comparison**: `--all-transports` runs the same test over direct UDP, SSH relay, and WebSocket relay in sequence. The gap between direct and relay tells you what you'd be giving up if a peer ends up behind symmetric NAT.

See the [Benchmarking docs](/docs/BENCHMARKING) for the full flag reference and S3 benchmarking guide.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
