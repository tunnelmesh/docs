# Coordinator High Availability

TunnelMesh supports multiple coordinators natively. Run two or more peers in coordinator mode and they find each other automatically, replicate data between themselves, and rebalance when the cluster topology changes. There is no single point of failure, no external load balancer required, and no shared filesystem.

## How It Works

Every coordinator is an equal peer — there is no leader, no primary, no replica distinction. When a coordinator joins the mesh it registers with `is_coordinator: true`, and every other coordinator in the cluster is notified and adds it to the replication pool.

Data is distributed across coordinators using chunk-level striping: each chunk of each object has a deterministic primary owner (`chunk_index mod num_coordinators`), and replicas are placed on the next N−1 coordinators in the ring. Concurrent writes are reconciled with version vectors, falling back to last-modified timestamp as a tiebreaker.

<img src="/docs/images/coordinator-ha.svg" alt="Coordinator HA: two coordinator peers connected by chunk replication arrows, with mesh peers fanning out below both">

## Setup

Point multiple peers at the same mesh. Configure each with coordinator mode enabled and its own local data directory — replication takes care of distribution, no shared storage needed.

```yaml
# coordinator-a.yaml
name: "coordinator-a"

coordinator:
  enabled: true
  listen: ":8443"
  data_dir: "/var/lib/tunnelmesh"
  admin_peers:
    - "a1b2c3d4e5f6g7h8"   # coordinator-a's peer ID
    - "b2c3d4e5f6g7h8i9"   # coordinator-b's peer ID
```

```yaml
# coordinator-b.yaml
name: "coordinator-b"

coordinator:
  enabled: true
  listen: ":8443"
  data_dir: "/var/lib/tunnelmesh"
  admin_peers:
    - "a1b2c3d4e5f6g7h8"
    - "b2c3d4e5f6g7h8i9"
```

Start both coordinators and have them join the same mesh. They discover each other through peer registration — no seed addresses or extra configuration needed.

```bash
# On host A — bootstraps the mesh
tunnelmesh join --config coordinator-a.yaml

# On host B — joins the existing mesh
tunnelmesh join coordinator-a.example.com:8443 --token your-token --config coordinator-b.yaml
```

Once coordinator-b has joined, coordinator-a receives the registration, sees `is_coordinator: true`, adds coordinator-b to the replication pool, and broadcasts the updated coordinator list to all mesh peers.

## Replication

Replication is asynchronous and queue-based. When an object is written to coordinator-a:

1. The write completes locally and is acknowledged to the client
2. coordinator-a enqueues a replication task
3. A background worker sends the chunk(s) to all peer coordinators in parallel (up to 5 concurrent operations, 60s per-peer timeout)
4. If a coordinator is unreachable, the task retries with exponential backoff (up to 3 attempts)
5. A periodic safety-net sync runs every 5 minutes: coordinator-a sends a full manifest of locally-owned objects; peers delete anything not in the manifest (handles lost delete messages)

Reads can be served from any coordinator. Clients that connect to coordinator-b while coordinator-a is down continue to operate on the replicated data.

> [!NOTE]
> TunnelMesh uses **eventual consistency** with deterministic conflict resolution. During a network partition where both coordinators accept writes to the same object, the conflict is resolved when connectivity is restored using version vectors; last-modified timestamp breaks ties.

## Scaling

Add more coordinators the same way — just join additional peers with coordinator mode enabled. The replication pool expands automatically, chunk assignments rebalance within 10 seconds (debounced), and at most 50 MB is transferred per rebalance cycle to avoid saturating the mesh.

```bash
# Add a third coordinator
tunnelmesh join coordinator-a.example.com:8443 --token your-token --config coordinator-c.yaml
```

> [!TIP]
> For cloud deployments, the Terraform modules in [Cloud Deployment](CLOUD_DEPLOYMENT.md) provision coordinator nodes alongside the rest of your infrastructure.

## What Peers See

Mesh peers receive the full list of coordinator mesh IPs in the `RegisterResponse`. When a coordinator is added or removed, the updated list is broadcast to all peers so they can reconnect through a healthy coordinator without manual reconfiguration.

## Related Documentation

- **[Cloud Deployment](CLOUD_DEPLOYMENT.md)** — Terraform provisioning for coordinator nodes
- **[Admin Guide](ADMIN.md)** — Coordinator configuration reference
- **[Docker Deployment](DOCKER.md)** — Multi-coordinator Docker Compose setup for local testing

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
