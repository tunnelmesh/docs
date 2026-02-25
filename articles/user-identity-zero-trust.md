---
title: "User Identity and Zero Trust in TunnelMesh"
date: 2026-01-19
author: TunnelMesh Team
excerpt: How TunnelMesh thinks about identity — from SSH key derivation to per-user packet filtering — and what "zero trust" actually means in a mesh network you control.
---

# User Identity and Zero Trust in TunnelMesh

<!-- TODO: Write this post -->
<!-- Tone: conceptual + practical. "Zero trust" is an overloaded marketing term — be precise about what you mean. -->

## What "zero trust" means here

<!-- Disambiguate from the marketing buzzword. In TunnelMesh: default-deny packet filtering, no implicit trust from being on the mesh, every connection requires valid authentication. -->

## Identity anchored in SSH keys

<!-- How node identity is derived from SSH host keys. The chain: SSH key → Noise static key → peer identity. No new PKI, no certificates to manage. -->

## The coordinator's role in identity

<!-- Token-based enrollment, how the coordinator issues a mesh IP, the peer registry, what the coordinator knows vs what it doesn't know (it can't decrypt traffic). -->

## Per-user vs per-node identity

<!-- Current state: identity is per-node. Discussion of multi-user scenarios and how the packet filter compensates. Future direction for user-level identity. -->

## Packet filtering as the enforcement point

<!-- How the internal packet filter implements zero trust: default-deny, rule-based allow, how rules reference peer identities. Link to the packet filter deep-dive post. -->

## Revoking access

<!-- What happens when a node is compromised: key rotation, coordinator revocation, how quickly changes propagate across the mesh. -->
