---
title: "NAT Traversal: The Dark Art of Making Peers Find Each Other"
date: 2025-11-17
author: TunnelMesh Team
excerpt: Getting two machines behind NAT to talk directly is harder than it should be. Here's how TunnelMesh does it — and what happens when it can't.
---

# NAT Traversal: The Dark Art of Making Peers Find Each Other

<!-- TODO: Write this post -->
<!-- Tone: technical storytelling. The author has clearly suffered through this problem. Wry humour welcome. -->

## Why NAT is the enemy

<!-- Explain the basic problem: both peers have private IPs, no public address, router rewrites ports. Why direct connectivity matters for performance. -->

## A taxonomy of NAT types

<!-- Full-cone, restricted-cone, port-restricted, symmetric. Which types hole-punching works with, which it doesn't. A table would work well here. -->

## STUN and the reflexive address trick

<!-- How peers learn their public IP:port. How TunnelMesh's coordinator acts as a lightweight STUN server. -->

## UDP hole punching in practice

<!-- The classic technique: simultaneous sends to open a pinhole. Walk through the timing and message exchange. Common failure modes. -->

## The SSH TCP fallback

<!-- When UDP hole-punching fails, TunnelMesh falls back to SSH tunnelling. Explain why TCP is harder than UDP for NAT traversal, and why SSH specifically. -->

## WebSocket relay: last resort

<!-- Symmetric NAT and corporate firewalls block everything else. How the coordinator WebSocket relay works, and the performance trade-off. -->

## Automatic path selection and promotion

<!-- How TunnelMesh continuously tries to upgrade to a better path. Include state machine diagram if possible. -->
