---
title: "The S3 Storage Backend: Sharing Object Storage Across the Mesh"
date: 2026-01-26
author: TunnelMesh Team
excerpt: TunnelMesh can expose a shared S3-compatible object store to all mesh nodes. Here's the architecture, the use cases it solves, and how to set it up.
---

# The S3 Storage Backend: Sharing Object Storage Across the Mesh

Every TunnelMesh coordinator runs an S3-compatible object store. It's mesh-only — bound to the coordinator's mesh IP, not reachable from outside. Any tool that speaks S3 — the AWS CLI, boto3, the Go AWS SDK — works with it without modification.

## What It's Good For

Object storage across the mesh opens up some useful patterns:

- **Build artifacts**: a CI runner in one cloud uploads a binary; runners in other regions download it without a public registry
- **Configuration distribution**: services pull their config from a shared bucket rather than a git clone or a config management system
- **Edge node backups**: nodes with local data push backups to the coordinator, where they're available to any mesh peer
- **Log aggregation**: services on mesh nodes write logs to S3; a central collector pulls from one place

The key distinction from NFS: object storage has no filesystem semantics. There's no concept of "currently open" files, no locking. If your use case is "share files I want to browse and edit", use NFS. If your use case is "move blobs reliably between services", use S3.

## Connecting to It

The coordinator exposes the S3 API at `http://coordinator.mesh:8080/s3`. Three authentication methods work:

- **AWS Signature V4** — the standard AWS auth scheme, used by the CLI and all SDKs
- **Basic Auth** — useful for quick scripts
- **Bearer token** — your TunnelMesh mesh token works directly

The easiest way to test it is the AWS CLI pointed at the mesh endpoint:

```bash
aws configure set aws_access_key_id your-peer-id
aws configure set aws_secret_access_key your-mesh-token
aws configure set default.endpoint_url http://coordinator.mesh:8080/s3

# Verify the connection
aws s3 ls
```

## Basic Operations

```bash
# Create a bucket
tunnelmesh bucket create build-artifacts

# Upload something
aws s3 cp ./dist/myapp s3://build-artifacts/v1.0/myapp

# Download from another peer
aws s3 cp s3://build-artifacts/v1.0/myapp ./myapp

# List bucket contents
aws s3 ls s3://build-artifacts/
```

Supported operations: `ListBuckets`, `CreateBucket`, `DeleteBucket`, `PutObject`, `GetObject`, `DeleteObject`, `ListObjectsV2`, `HeadObject`, `CopyObject`. Enough to cover the common S3 use cases.

## The System Bucket

`_tunnelmesh` is a reserved bucket — don't write to it. The coordinator uses it to store peer registration data, network configuration, and NFS share metadata. It's the coordinator's source of truth.

Back this bucket up. It's everything the coordinator needs to recover from a restart or migration.

## Storage Quotas

To avoid any single bucket consuming all available space:

```bash
# Set a 1GB quota
tunnelmesh bucket quota set build-artifacts 1GB

# Check usage
tunnelmesh bucket usage build-artifacts
```

Storage is configured in `coordinator.yaml`:

```yaml
s3:
  data_dir: /var/lib/tunnelmesh/s3
  max_size: 10GB
```

See the [S3 Storage docs](/docs/S3_STORAGE) for the full API reference and Go/Python SDK examples.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
