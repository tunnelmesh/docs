---
title: "Inside the Transport Fallback Chain: UDP, SSH, and WebSocket Relay"
date: 2025-12-22
author: TunnelMesh Team
excerpt: A technical walkthrough of how TunnelMesh selects, negotiates, and promotes transport paths between peers — and the engineering decisions behind the three-level fallback.
---

# Inside the Transport Fallback Chain: UDP, SSH, and WebSocket Relay

<!-- TODO: Write this post -->
<!-- Tone: engineering deep dive. Include state diagrams and/or sequence diagrams. This is one of the more technically interesting parts of the system. -->

## The fundamental challenge

<!-- Reminder of why this is hard: NAT, firewalls, asymmetric connectivity. What "best path" means and why it's dynamic. -->

## Level 1: Direct UDP with hole-punching

<!-- The happy path. Initiating a hole-punch attempt, the exchange of candidates via the coordinator, what success looks like. Latency profile. When this fails (symmetric NAT, aggressive firewalls). -->

## Level 2: SSH tunnelling

<!-- Why SSH as TCP fallback? Port 22 usually open outbound, existing SSH daemons common on nodes, ProxyJump semantics. How TunnelMesh sets up the tunnel, what the user needs to configure. Performance trade-off vs UDP. -->

## Level 3: WebSocket relay through the coordinator

<!-- The last resort. How WebSocket relay works: both peers connect outbound to coordinator, coordinator stitches the streams. Bandwidth and latency implications. When does this trigger? -->

## Path selection state machine

<!-- Diagram: PROBING → DIRECT / RELAY, promotion logic (if direct path becomes available, switch), keepalive probes, hysteresis to avoid flapping. -->

## Monitoring the active path

<!-- How to tell which transport a peer is using (CLI, metrics). Prometheus metric names. What flapping looks like in logs. -->

## Future: QUIC as an alternative path

<!-- Brief mention of QUIC's potential benefits here: built-in multiplexing, connection migration. Status and timeline if known. -->
