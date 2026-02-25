---
title: "New Year, New Mesh: Where TunnelMesh Is Going in 2026"
date: 2026-01-05
author: TunnelMesh Team
excerpt: An honest look at where the project stands, what's working, what still needs work, and what we're building next.
---

# New Year, New Mesh: Where TunnelMesh Is Going in 2026

Three months since the initial release. Good time to take stock.

## What Shipped

The October release had more in it than we originally planned: full P2P mesh networking, NAT traversal, NFS, S3-compatible storage, Docker, Prometheus metrics, and Terraform deployment modules. That was too much to ship at once, and the documentation showed it — some sections thorough, some skeletal.

Since then, we've been fixing the things that broke in the wild:

- A bug in the SSH relay fallback that caused connections to stall (rather than fail cleanly) under high packet loss
- NFS mounts going stale after coordinator restarts, requiring manual remounts
- DNS caching interactions on systems running systemd-resolved

None of these were catastrophic, but all of them were annoying. All fixed.

## What We're Still Not Happy With

**The install experience.** Getting a first mesh running requires `tunnelmesh init`, then a coordinator config file, then `tunnelmesh join`. That's three commands and a YAML file before anything happens. We're working on collapsing this into a guided first-run flow.

**Coordinator high availability.** Running multiple coordinators is supported — they discover each other automatically and replicate data peer-to-peer. The setup documentation was lacking; that's now fixed with a dedicated [HA guide](../docs/HIGH_AVAILABILITY.md).

**Windows.** The Windows client works but it's second-class: different TUN code path, rougher service installer, and DNS resolution falls back to hosts-file entries instead of a proper resolver. Windows users are keeping us honest.

## What We're Building Next

**Policy-as-code.** Packet filter rules currently live in coordinator YAML and get poked via the CLI. We want rules to be declarative, version-controlled, and applied by a reconciler — the same way you'd manage Kubernetes RBAC. This also makes changes reviewable and auditable.

**Multi-coordinator federation.** The current model is one coordinator per mesh. Federation lets two separate meshes peer with each other — useful when two teams or organisations want to share specific services without merging their entire networks.

**Better observability.** The Prometheus integration exists, but the metrics are coarse. Per-flow latency histograms and per-peer packet loss rates are in progress.

The [GitHub repository](https://github.com/tunnelmesh/tunnelmesh) is where releases happen. Issues and feature requests are welcome.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
