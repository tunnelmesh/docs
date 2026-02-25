---
title: "TunnelMesh in the Wild: Early Deployment Lessons"
date: 2026-02-02
author: TunnelMesh Team
excerpt: A few months in, TunnelMesh is running on real infrastructure. Here's what we learned from watching it operate outside our own machines.
---

# TunnelMesh in the Wild: Early Deployment Lessons

There's a version of the software you build and test on your own machines. Then there's the version that runs in the real world, where other people's networks are involved. They're different.

Here's what we learned from the gap.

## The Use Cases We Didn't Anticipate

We built TunnelMesh for distributed homelab and cloud workloads — the mesh-as-infrastructure use case. That's not the primary thing people are using it for.

**Remote access** is the entry point for most people. The exit peer feature — routing all internet traffic from a device through a specific mesh node — turns TunnelMesh into a self-hosted VPN. Users care about one thing: "I want to browse from my home IP while travelling, and I don't want to trust a third party with my traffic." TunnelMesh happens to do this well.

**CI/CD runner meshes** came up repeatedly. Runners in different clouds can reach internal services (private git servers, artifact registries, databases) without punching firewall holes between clouds. The packet filter handles which runners reach which services. The coordinator keeps the membership list.

**Team developer meshes** are simpler than they sound: a few developers want their laptops and dev servers to talk directly, share a network filesystem, and access each other's locally-running services. TunnelMesh makes this a `tunnelmesh join` on each machine.

## What Broke in the Real World

**DNS caching.** TunnelMesh's resolver handles `*.mesh` domains. On systems where systemd-resolved or another caching resolver sits in front, newly-joined peers weren't resolvable by name until the cache expired. We added TTL hints to the resolver. It's better; it's not perfect on all configurations.

**Coordinator restart behaviour.** When the coordinator restarts, peers re-establish connections quickly. NFS mounts taken during the brief reconnect window sometimes go stale instead of healing automatically. The workaround is to remount; the proper fix (keeping mounts alive through coordinator reconnects) is in progress.

**The metrics port collision.** TunnelMesh exposes a metrics server on a default port. If you run a coordinator and a peer on the same machine — which is common for single-node setups — the ports collide. The docs now say this clearly. It shouldn't have been a surprise.

## What Held Up

The transport fallback chain worked better than we expected. Direct UDP hole-punching succeeds on most home networks. SSH relay handles the cases it doesn't. We haven't encountered a real-world network where WebSocket relay wasn't sufficient as a last resort.

Reconnection speed after coordinator restarts has been fine in practice. Sub-second from detecting a disconnect to re-establishing encrypted sessions, for most workloads.

The packet filter hasn't had correctness bugs. Default-deny with explicit allows is a model people understand quickly, and the rule syntax is straightforward enough that most users don't need to consult the docs after the first time.

## The Practical Lessons

Coordinator sizing matters more than we communicated initially. A small VPS handles light meshes fine. At larger scales, relay throughput, WebSocket connection count, and S3 storage I/O all compete for the same CPU and bandwidth. The [Cloud Deployment docs](/docs/CLOUD_DEPLOYMENT) have updated sizing guidance.

Mesh DNS is the thing people notice first when something goes wrong. If `peer-name.mesh` doesn't resolve, nothing else works. This is the most common reason for a frustrating first experience, and we've added significantly more troubleshooting guidance to the [Getting Started docs](/docs/GETTING_STARTED).

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
