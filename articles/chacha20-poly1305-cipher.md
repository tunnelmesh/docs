---
title: "ChaCha20-Poly1305: The Cipher Powering TunnelMesh"
date: 2025-12-01
author: TunnelMesh Team
excerpt: A deep dive into why we chose ChaCha20-Poly1305 over AES-GCM, how AEAD ciphers work, and what the performance profile looks like on the hardware TunnelMesh actually runs on.
---

# ChaCha20-Poly1305: The Cipher Powering TunnelMesh

<!-- TODO: Write this post -->
<!-- Tone: technical, but don't assume cryptography background. A strong systems programmer should follow along. -->

## AEAD ciphers in one paragraph

<!-- What Authenticated Encryption with Associated Data means. Why you want both confidentiality and integrity from one primitive. -->

## ChaCha20: the stream cipher

<!-- Design: ARX construction, 256-bit key, 96-bit nonce, 32-bit counter. Why Bernstein designed it, the relationship to Salsa20. No math required — intuition is enough. -->

## Poly1305: the MAC

<!-- One-time MAC, how it's paired with ChaCha20 for authentication. The importance of never reusing a (key, nonce) pair. -->

## Why not AES-GCM?

<!-- The real-world case for ChaCha20-Poly1305: constant-time on hardware without AES-NI (ARM SBCs, older CPUs), simpler nonce management than GCM. Not a knock on AES — explain when AES-GCM wins. -->

## Performance on TunnelMesh's target hardware

<!-- Benchmarks: x86_64 server, ARM64 (Raspberry Pi / Apple Silicon), older ARM32. Numbers from Go's crypto/chacha20poly1305. -->

## Nonce management in TunnelMesh

<!-- How TunnelMesh derives per-packet nonces. Counter-based, what happens at rollover, how the Noise framework handles this. -->
