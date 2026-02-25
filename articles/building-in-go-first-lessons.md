---
title: "Building in Go: What a Month of TunnelMesh Taught Us"
date: 2025-11-24
author: TunnelMesh Team
excerpt: A month into writing a networking tool in Go — what the language got right, where we hit walls, and the libraries that saved us.
---

# Building in Go: What a Month of TunnelMesh Taught Us

TunnelMesh is written in Go. A month in, that decision looked smart in some places and painful in others. Here's the honest version.

## Why Go?

The core of TunnelMesh is a lot of things happening at once: managing connections to dozens of peers, reading packets from a virtual network interface, running a DNS server, probing NAT, sending metrics. In Python you'd be fighting the event loop. In C you'd be managing threads manually. In Go you just start goroutines and let the scheduler handle it.

The other reason: one binary that runs on Linux, macOS, and Windows, for x86_64 and ARM, built with a single `go build` command. For a tool that needs to run on everything from a Raspberry Pi to a cloud VM, that's worth a lot.

## The TUN Interface Is Not Plug and Play

The TUN device is how TunnelMesh intercepts packets. It's a virtual network interface — your OS routes packets destined for mesh IPs into it, TunnelMesh reads them, encrypts them, and sends them to the right peer. Packets coming back from peers get decrypted and written back to the same device.

Go's standard library doesn't touch any of this. You need root privileges (`CAP_NET_ADMIN` on Linux), access to `/dev/net/tun`, and a library that handles the platform differences.

We use the TUN library from the WireGuard project. It's well-tested, handles Linux, macOS, and Windows, and the edge cases are already worked out.

The tricky part: testing this in CI. You can't create TUN devices in a normal test environment. Our solution was Docker containers with `NET_ADMIN` capability and the TUN device explicitly added — the same setup the production Docker docs describe.

## Don't Write Your Own Noise Implementation

We did. It was a mistake.

The Noise handshake involves key derivation, hashing, cipher operations, and careful sequencing of operations. Getting it right means your implementation matches the spec exactly — and the spec has test vectors you can check against, but only if you know to look.

We found [flynn/noise](https://github.com/flynn/noise) about three weeks in, after our implementation was mostly working but had subtle divergences from the spec in error-path handling. Replacing it with the library was a day's work and removed several hundred lines of code we'd never have to worry about again.

The lesson: for cryptographic primitives, use a library. The bugs in hand-rolled crypto are the kind that look fine in testing and are catastrophic in production.

## Goroutine Lifecycle Is Harder Than It Looks

Go makes it trivially easy to start goroutines. It does not make it trivially easy to stop them.

The pattern — pass a `context.Context`, check `ctx.Done()` in select statements, signal completion via a `sync.WaitGroup` — is well-known. The failure mode is goroutines that block on I/O and don't check the context. They keep running after shutdown, holding file descriptors and preventing clean restarts.

The fix is defensive: set deadlines on all I/O, put `ctx.Done()` in every `select`. It's tedious but mechanical once you know to do it.

## Testing Network Code

Unit tests cover deterministic logic: packet filter rule evaluation, key derivation, config parsing. These are fast and catch regressions.

For anything involving actual networking — NAT traversal, relay fallback, the full peer handshake — we use Docker integration tests. A Compose stack spins up a coordinator and multiple peers, deliberately misconfigured to force the fallback chain to engage, and verifies end-to-end connectivity. These are the tests that catch the real bugs.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
