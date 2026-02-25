---
title: "Benchmarking TunnelMesh: Real Numbers from Real Hardware"
date: 2026-01-12
author: TunnelMesh Team
excerpt: We ran TunnelMesh against a baseline and against alternatives. Here are the iperf3, latency, and CPU numbers — methodology included so you can reproduce them.
---

# Benchmarking TunnelMesh: Real Numbers from Real Hardware

<!-- TODO: Write this post -->
<!-- Tone: rigorous and honest. Show methodology, show the numbers that aren't flattering too. Link to raw data if possible. -->

## Test environment

<!-- Hardware specs (nodes, coordinator), OS versions, kernel, network conditions (LAN, DC cross-region, home internet). Be precise — benchmarks without environment details are useless. -->

## Methodology

<!-- How tests were run: iperf3 settings, ping parameters, number of runs, how outliers were handled. What was held constant. -->

## Baseline: raw UDP throughput

<!-- What the hardware can do without TunnelMesh in the path. Establish the ceiling. -->

## TunnelMesh over direct UDP

<!-- Throughput, latency (avg/p99), CPU usage on both ends. Overhead vs baseline as a percentage. -->

## TunnelMesh over WebSocket relay

<!-- Same metrics. Quantify the relay penalty. -->

## Comparison with WireGuard

<!-- Head-to-head throughput and CPU. TunnelMesh will likely lose on raw speed (WireGuard has kernel module); explain why and when that trade-off is worth it. -->

## Raspberry Pi / ARM results

<!-- This is where ChaCha20 shines over AES-GCM. Show the numbers on hardware without AES-NI. -->

## Key takeaways

<!-- Summarise honestly: where TunnelMesh performs well, where it doesn't, what the numbers mean for real deployments. -->
