---
title: "Building in Go: What a Month of TunnelMesh Taught Us"
date: 2025-11-24
author: TunnelMesh Team
excerpt: A month into writing a networking tool in Go — what the language got right, where we hit walls, and the libraries that saved us.
---

# Building in Go: What a Month of TunnelMesh Taught Us

<!-- TODO: Write this post -->
<!-- Tone: personal engineering reflection. Honest about mistakes and surprises. Not a Go tutorial or evangelism piece. -->

## Why Go for a networking tool

<!-- The decision: goroutines for concurrent connections, strong stdlib net/ package, easy cross-compilation, single binary deploys. Brief mention of what we considered (Rust, C). -->

## What Go gets right for this problem

<!-- goroutine-per-connection model, net.Conn/net.PacketConn interfaces, context cancellation. Concrete examples from the codebase. -->

## The gotchas we hit

<!-- Be specific: e.g. TUN device syscalls, raw socket permissions, CGO complications, sync/atomic footguns, etc. -->

## Libraries worth highlighting

<!-- golang.org/x/crypto for ChaCha20, gvisor's netstack? or native TUN libs, any other key deps. Why each was chosen. -->

## Testing concurrent networking code

<!-- The challenge of writing reliable tests for UDP hole-punching and relay fallback. What approaches worked. -->

## What we'd do differently

<!-- Honest retrospective: anything you'd reach for differently now? This keeps it from sounding like a PR piece. -->
