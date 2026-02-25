---
title: "The Internal Packet Filter: Fine-Grained ACLs for Mesh Networks"
date: 2026-02-09
author: TunnelMesh Team
excerpt: A deep dive into TunnelMesh's packet filter — the default-deny firewall that lives inside the tunnel and gives you per-peer, per-protocol access control without touching the host firewall.
---

# The Internal Packet Filter: Fine-Grained ACLs for Mesh Networks

<!-- TODO: Write this post -->
<!-- Tone: technical deep dive. This is a core security feature — be precise. Include rule syntax examples. -->

## Why an in-process packet filter?

<!-- The problem with relying on host firewalls: they're external to TunnelMesh, inconsistent across OSes, and don't understand mesh identity. The filter runs inside the TUN layer and enforces policy before packets hit the host network stack. -->

## The default-deny stance

<!-- Explain why default-deny matters: being on the mesh doesn't grant access to everything. Every flow must be explicitly permitted. How this differs from traditional VPN models. -->

## Filter rule anatomy

<!-- Syntax breakdown: source peer/group, destination peer/group, protocol, port, action (allow/drop/reject). Show 3-4 concrete examples — SSH access, service port, ICMP, default rule. -->

## Rule evaluation order

<!-- How rules are matched: first-match, last-match, or priority-based? What happens when no rule matches. How to debug a dropped packet. -->

## Groups and identity tags

<!-- Grouping peers by role (e.g., "ci-runners", "admin-nodes"). How groups are defined, how they map to filter rules. Benefits for managing larger meshes. -->

## Performance impact

<!-- Filter rules are in the hot path of every packet. Benchmark numbers: overhead per packet, rule table size impact, optimisations (hash-based lookup, early exits). -->

## Integration with the audit log

<!-- How to enable packet filter logging, what gets logged (allowed and denied), using logs for debugging vs security audit. -->
