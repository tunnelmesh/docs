---
title: "The Noise Protocol: How TunnelMesh Handles Encryption"
date: 2025-11-10
author: TunnelMesh Team
excerpt: A practical walkthrough of the Noise IKpsk2 handshake pattern — why we chose it, what it gives us for free, and what the handshake actually looks like on the wire.
---

# The Noise Protocol: How TunnelMesh Handles Encryption

<!-- TODO: Write this post -->
<!-- Tone: technical but accessible. Assume the reader knows what TLS is but hasn't read the Noise spec. -->

## Why not TLS?

<!-- Brief case for Noise over TLS for this use case: simpler, no certificates, better forward secrecy story, no CA needed. -->

## The Noise framework in 60 seconds

<!-- High-level overview: handshake patterns, static/ephemeral keys, transport phase. Link to noiseprotocol.org. -->

## IKpsk2: the pattern we use

<!-- Walk through the IKpsk2 pattern step by step. What messages are exchanged, what each side proves about itself, and where the PSK mixes in. Use a message diagram. -->

## Key derivation from SSH keys

<!-- How TunnelMesh derives Noise static keys from existing SSH host keys — rationale (no new PKI) and the mechanics. -->

## ChaCha20-Poly1305 for transport

<!-- Why this cipher over AES-GCM: ARM/embedded performance, no timing side-channels, same security strength. -->

## What the handshake looks like on the wire

<!-- pcap walkthrough or byte-level description of a real TunnelMesh handshake. Optional: include a Wireshark screenshot. -->

## Security properties we get (and don't get)

<!-- Honest summary: mutual auth, forward secrecy, replay protection. What Noise doesn't protect against (traffic analysis, etc.). -->
