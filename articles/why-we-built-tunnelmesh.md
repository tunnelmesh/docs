---
title: Why We Built TunnelMesh
date: 2025-11-03
author: TunnelMesh Team
excerpt: Every side project starts with a frustration. Ours started with a weekend of fighting WireGuard configs, broken NAT traversal, and the realisation that none of the existing tools did exactly what we needed.
---

# Why We Built TunnelMesh

It started, as these things do, with a lazy Sunday afternoon that turned into a four-hour debugging session.

We had a few machines spread across home networks, a VPS, and a rented server. Nothing exotic. We wanted them to talk to each other securely — private IPs, encrypted traffic, no relying on a third party. Simple enough, right?

## The Hub-and-Spoke Trap

Most VPN tools are built around a hub-and-spoke model. Think of it like a wheel:

![Hub-and-spoke topology: all traffic routes through the hub server](/articles/images/hub-and-spoke.svg)

Every packet between Laptop A and Laptop B travels through the hub, even if they're on the same LAN. That hub is your central server — the one you're paying for, the one that becomes a bottleneck, and the one that takes everything down when it has a bad day.

We didn't want a wheel. We wanted a mesh.

## What We Actually Wanted

After a few frustrating evenings we wrote down what the tool needed to do:

- **Self-hosted** — our data, our coordinator, no cloud subscription required
- **Direct connections** — peers talk to each other peer-to-peer when possible, relay only as a last resort
- **Modern crypto** — the [Noise Protocol](https://noiseprotocol.org/), not a hand-rolled cipher or ageing TLS configuration
- **No new keys to manage** — use the SSH keys that are already on every machine
- **Default-deny networking** — being on the mesh shouldn't mean trusting everyone on the mesh

We looked at the options. WireGuard has excellent crypto but no built-in peer discovery — you're editing config files and distributing keys by hand. Tailscale ticks most boxes but isn't fully self-hosted. ZeroTier has its own crypto. None of them felt like the right foundation.

## Starting From the Noise Spec

We started from a protocol rather than from a product.

The [Noise Protocol Framework](https://noiseprotocol.org/) gave us a handshake pattern (`IKpsk2`) with mutual authentication, forward secrecy, and network binding built in. ChaCha20-Poly1305 for encrypting the actual traffic — fast on ARM chips, no timing side-channels. Derive the identity keys from each machine's existing SSH key, and suddenly every box already has a cryptographic identity.

On top of that we built the thinnest coordinator we could: it hands out IP addresses, helps peers find each other, and provides relay as a fallback. It can't read anyone's traffic.

## The First Test

The first end-to-end connection was two laptops on different home networks, 2ms round-trip, direct UDP, everything encrypted. That took a weekend.

The next several weeks were the hard part — symmetric NAT, corporate firewalls, the edge cases that turn "it works on my network" into "it works reliably everywhere." The three-level transport fallback (UDP → SSH → WebSocket relay) exists because of those edge cases.

But that first working connection was enough to know the idea was sound.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
