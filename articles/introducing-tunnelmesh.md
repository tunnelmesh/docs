---
title: Introducing TunnelMesh: Encrypted Mesh Networking for the Next Frontier
date: 2025-10-28
author: TunnelMesh Team
excerpt: Today we're open-sourcing TunnelMesh — a P2P mesh networking tool built in Go that creates encrypted tunnels between nodes using the Noise IKpsk2 protocol with ChaCha20-Poly1305 encryption.
---

# Introducing TunnelMesh

Today we're open-sourcing **TunnelMesh** — a P2P mesh networking tool built in Go that creates encrypted tunnels between nodes using the Noise IKpsk2 protocol with ChaCha20-Poly1305 encryption.

## Why Another VPN?

Traditional VPN solutions require hub-and-spoke topology — all traffic flows through a central server. This creates a single point of failure, adds latency for geographically distributed nodes, and limits throughput to what the hub server can handle.

TunnelMesh is built differently. Every peer connects directly to every other peer whenever possible, falling back to relay only when NAT prevents direct connectivity. The result is a fully-meshed network where bandwidth scales with node count rather than bottlenecking at a central server.

## The Noise Protocol

At the heart of TunnelMesh is the [Noise Protocol Framework](https://noiseprotocol.org/), specifically the `IKpsk2` handshake pattern. This gives us:

- **Mutual authentication** — both peers verify each other's identity using static Diffie-Hellman keys derived from SSH keys
- **Forward secrecy** — ephemeral keys ensure past sessions can't be decrypted even if long-term keys are compromised
- **Pre-shared key mixing** — an additional layer of authentication that ties peers to a specific network

All session traffic is encrypted with **ChaCha20-Poly1305**, a modern AEAD cipher that performs well on hardware without AES acceleration (common in embedded devices and older ARM chips).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Coordinator                           │
│  • Peer discovery & IP allocation                       │
│  • Relay fallback (WebSocket)                           │
│  • Mesh DNS (100.100.x.x → peer.mesh)                  │
│  • Admin API & web dashboard                            │
└──────────────────────┬──────────────────────────────────┘
                       │ coordinator-assisted discovery
        ┌──────────────┴──────────────┐
        ▼                             ▼
   ┌─────────┐    UDP (Noise)    ┌─────────┐
   │  Peer A │◄────────────────►│  Peer B │
   │  node   │                  │  node   │
   └─────────┘                  └─────────┘
```

Each peer runs a TUN interface that handles transparent IP routing. Packets destined for mesh IPs (`100.64.0.0/10`) are captured by the TUN device and routed through the appropriate encrypted tunnel.

## Transport Fallback Chain

Getting peers behind NAT to talk directly is the hard part. TunnelMesh uses a three-level fallback:

1. **UDP** — Direct peer-to-peer with hole punching. Sub-millisecond overhead on LAN, works through most consumer NAT.
2. **SSH** — TCP-based fallback that traverses stricter firewalls. Uses the existing SSH infrastructure many nodes already have.
3. **WebSocket relay** — Last resort. Traffic is relayed through the coordinator's WebSocket server when direct connectivity is impossible (symmetric NAT, corporate firewalls).

## What's Included

The initial release ships with:

- Full mesh P2P networking with automatic NAT traversal
- Mesh DNS resolution (`peer-name.mesh` → `100.64.x.x`)
- Zero-trust packet filtering (default-deny with rule-based allow)
- S3-compatible object storage shared across the mesh
- NFS file sharing over the mesh
- Docker integration with automatic port-forward rules
- Prometheus metrics + Grafana dashboards
- Terraform modules for DigitalOcean deployment

## Getting Started

Check out the [Quick Start Guide](/docs/GETTING_STARTED) to get your first mesh running in under 10 minutes.

```bash
# Download the latest release
curl -L https://github.com/tunnelmesh/tunnelmesh/releases/latest/download/tunnelmesh-linux-amd64.tar.gz | tar xz

# Start a coordinator
sudo ./tunnelmesh coordinator --config coordinator.yaml

# Join from another node
sudo ./tunnelmesh join --coordinator https://your-coordinator:8443 --token your-token
```

## What's Next

We're actively working on:

- **Multi-coordinator federation** — mesh clusters that span organizational boundaries
- **Improved observability** — per-flow latency histograms and packet loss metrics
- **Policy-as-code** — declarative filter rules managed through GitOps

Follow the [GitHub repository](https://github.com/tunnelmesh/tunnelmesh) for updates, and open issues for bugs or feature requests.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
