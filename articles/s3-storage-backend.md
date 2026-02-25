---
title: "The S3 Storage Backend: Sharing Object Storage Across the Mesh"
date: 2026-01-26
author: TunnelMesh Team
excerpt: TunnelMesh can expose a shared S3-compatible object store to all mesh nodes. Here's the architecture, the use cases it solves, and how to set it up.
---

# The S3 Storage Backend: Sharing Object Storage Across the Mesh

<!-- TODO: Write this post -->
<!-- Tone: feature explainer + practical guide. Include a real example of something useful to store. -->

## Why object storage on the mesh?

<!-- Use cases: shared build artifacts, config distribution, log aggregation, backups from edge nodes. The common thread: structured data that doesn't need a filesystem. -->

## Architecture

<!-- Where the S3 backend runs (coordinator or dedicated node), the S3-compatible API surface (which AWS S3 operations are supported), how credentials are scoped per-peer. Diagram of a read request through the mesh. -->

## Under the hood

<!-- What backs the storage: local disk, passthrough to a real S3 bucket, or something else. How data is routed through the mesh (it uses the encrypted TUN path like any other traffic). -->

## Setting it up

<!-- Step-by-step: enabling in coordinator config, creating buckets, configuring an access key for a mesh node, using the AWS CLI or an SDK to verify it works. -->

## Using it from your applications

<!-- AWS SDK configuration to point at the mesh S3 endpoint. A Python/Go/Node example. S3FS or Mountpoint for mounting as a filesystem. -->

## Limitations and when to use NFS instead

<!-- Object storage vs filesystem trade-offs. Latency for small files, no locking, eventual consistency model. -->
