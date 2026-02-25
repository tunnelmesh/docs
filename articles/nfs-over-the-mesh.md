---
title: "NFS Over TunnelMesh: Secure File Sharing Across the Mesh"
date: 2025-12-15
author: TunnelMesh Team
excerpt: NFS was designed for trusted local networks. TunnelMesh makes the mesh a trusted local network — here's how we use that to share files securely across geographically distributed nodes.
---

# NFS Over TunnelMesh: Secure File Sharing Across the Mesh

<!-- TODO: Write this post -->
<!-- Tone: practical + a little opinionated. NFS is old and weird but it works. -->

## Why NFS?

<!-- NFS is widely supported, has good Linux kernel integration, works with existing tooling (mount, fstab, autofs). Alternatives considered: SSHFS (slower), Samba (Windows-centric), S3 (not a filesystem). -->

## The trust model

<!-- NFS has almost no built-in security — it was designed for trusted LANs. TunnelMesh provides that trust: all traffic is encrypted and mutually authenticated before it hits the NFS layer. -->

## Architecture

<!-- Where the NFS server runs (coordinator node or any peer), how clients mount shares using mesh DNS names, the flow of a read/write through the stack: app → TUN → Noise → NFS server. Diagram would help. -->

## Setting it up

<!-- Concrete steps: configuring the NFS server, exporting shares, mounting from a mesh node, /etc/fstab entry. Linux-focused but note macOS differences. -->

## Performance characteristics

<!-- Latency vs LAN NFS. Throughput numbers over UDP vs relay. When to use NFS vs the S3 backend. -->

## Caveats and gotchas

<!-- NFSv3 vs NFSv4, file locking over lossy links, what happens when a node disconnects while a share is mounted. -->
