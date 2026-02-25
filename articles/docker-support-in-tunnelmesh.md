---
title: "Docker Integration: Containers as First-Class Mesh Citizens"
date: 2025-12-08
author: TunnelMesh Team
excerpt: With Docker integration, containers on the mesh get automatic port-forward rules, mesh DNS, and the same zero-trust filtering as bare-metal nodes.
---

# Docker Integration: Containers as First-Class Mesh Citizens

If you're running TunnelMesh, you're probably also running containers. Keeping those two things separate — mesh on the host, containers in their own isolated world — means a lot of manual wiring. TunnelMesh's Docker integration is designed to make containers first-class mesh participants from the start.

## Getting a Full Mesh Running in Docker

The TunnelMesh repository ships a complete Compose stack. One command gets you a coordinator, multiple peers, and monitoring:

```bash
docker compose up -d

# Need more peers?
docker compose up -d --scale peer=3
```

That's a real working mesh — encrypted tunnels, mesh DNS, packet filtering — all running in containers.

## The Two Things Every Container Needs

A container can't join the mesh unless it has two things:

```yaml
cap_add:
  - NET_ADMIN       # permission to create and configure network interfaces
devices:
  - /dev/net/tun    # the kernel device TunnelMesh reads and writes packets through
```

`NET_ADMIN` is a Linux capability that allows the container to modify network interfaces. `/dev/net/tun` is how TunnelMesh intercepts packets at the OS level. Both are explicitly granted in the Compose file — they're not available by default for security reasons.

## Three Ways to Connect Containers to the Mesh

**Bridge network** is the default. Each container gets its own network namespace, and the TUN interface handles mesh traffic:

```
 Container A          Mesh          Container B
[app process]  ←─ TUN device ─→  [app process]
[own netns   ]                    [own netns   ]
```

**Host network** shares the host's network namespace. The container and the host machine share the same mesh IP — useful when you need the mesh address directly accessible on the host:

```yaml
network_mode: host
```

**Shared namespace** is a sidecar pattern. One container joins the mesh; others borrow its network namespace. This lets you put apps on the mesh without modifying their container image:

```yaml
# The mesh peer
network_mode: service:tunnelmesh-peer
```

## Checking That It Worked

After `docker compose up`, verify the peers are connected:

```bash
docker compose exec peer tunnelmesh status
docker compose exec peer tunnelmesh peers
```

A healthy peer shows its assigned mesh IP (`100.64.x.x`), lists other peers, and shows which transport each connection is using (direct UDP, SSH relay, or WebSocket relay).

## Building the Image

If you need a custom image or want to pin a specific version:

```bash
make docker-build        # build for current platform
make docker-push         # build multi-arch and push
```

See the [Docker docs](/docs/DOCKER) for the full configuration reference, including health checks, volume configuration, and production considerations.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
