---
title: "ChaCha20-Poly1305: The Cipher Powering TunnelMesh"
date: 2025-12-01
author: TunnelMesh Team
excerpt: A deep dive into why we chose ChaCha20-Poly1305 over AES-GCM, how AEAD ciphers work, and what the performance profile looks like on hardware without AES acceleration.
---

# ChaCha20-Poly1305: The Cipher Powering TunnelMesh

Every packet that flows through a TunnelMesh tunnel is scrambled so that only the intended recipient can unscramble it, and any attempt to tamper with it in transit will be detected. This is the job of the cipher.

TunnelMesh uses **ChaCha20-Poly1305**. Here's what that means and why we chose it over the alternatives.

## Encryption vs. Authenticated Encryption

Plain encryption gives you *confidentiality*: an eavesdropper can't read the packet. But it doesn't stop them from flipping bits in the ciphertext; they won't know what they changed, but neither will you. On the receiving end, you'd decrypt corrupted garbage and have no idea.

**AEAD** (Authenticated Encryption with Associated Data) solves this by bundling encryption and a tamper-detection code in one operation. Every TunnelMesh packet has a 16-byte tag appended to it. If the ciphertext or headers are modified in any way, the tag check fails and the packet is silently dropped before it ever reaches your application.

Think of it like a sealed envelope with a wax stamp: you can read the writing inside, but if anyone breaks the seal, you know.

## ChaCha20: The Encryption Half

ChaCha20 is a *stream cipher*. It takes a key and a nonce (a one-time number), and generates a stream of pseudorandom bytes. XOR that stream with your plaintext and you get ciphertext.

The internals use only three operations (**A**dd, **R**otate, **X**OR) applied in a fixed pattern. This is called an ARX construction, and it has a useful property: it runs at the same speed regardless of the input data. No timing variations that an attacker could exploit.

## Poly1305: The Authentication Half

Poly1305 is a message authentication code: it produces a short fingerprint of the encrypted data. The fingerprint key is derived from ChaCha20 itself: the first 32 bytes of the keystream are used as the MAC key and immediately discarded.

This means the MAC key is always fresh and can never be recovered from the ciphertext, a neat bit of construction that eliminates a whole class of attack.

## Why Not AES?

AES is excellent. It's the standard choice in TLS, and on modern Intel/AMD processors with dedicated AES-NI hardware instructions it's very fast.

The problem is hardware without AES-NI:

```
Raspberry Pi 3 (ARM Cortex-A53): no AES-NI
Older cloud VMs (some vCPU types): AES-NI not exposed
Many embedded/router SoCs: no AES-NI
```

On these platforms, software AES is slow *and* hard to implement safely. Naive implementations leak timing information based on input data, a known side-channel attack. ChaCha20's ARX construction is inherently constant-time regardless of the hardware.

On a modern laptop with AES-NI, AES-GCM will edge out ChaCha20-Poly1305 in raw throughput. On the full range of hardware TunnelMesh runs on, ChaCha20-Poly1305 wins on consistency and safety.

## Seeing It in Practice

The cipher overhead is included in what `tunnelmesh benchmark` measures:

```bash
# Test throughput to a peer
tunnelmesh benchmark --peer my-server --duration 30s
```

On CPU-bound workloads the cipher will hit its ceiling before your network does. The Go standard library uses assembly-optimised paths for ChaCha20-Poly1305 on amd64 and arm64, so even on modest hardware the overhead is small.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
