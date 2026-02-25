---
title: "Docker Integration: Managing Containers Across the Mesh"
date: 2025-12-08
author: TunnelMesh Team
excerpt: TunnelMesh's admin panel includes a Docker tab that lets you view, start, stop, and inspect containers running on any mesh node — without SSH-ing into each machine.
---

# Docker Integration: Managing Containers Across the Mesh

Running containers across a distributed mesh means containers are spread across machines in different locations. The TunnelMesh admin panel's Docker tab pulls them all into one view, letting you manage them without jumping between SSH sessions.

## What It Does

From the Docker panel, an admin can:

- **View all containers** running on mesh nodes — name, image, status, uptime
- **Start, stop, and restart** containers remotely
- **View container stats** — CPU, memory, network I/O
- **View container logs** — streamed directly in the panel

The panel is admin-only by default, but access can be granted to specific peers without giving them full admin rights:

```bash
# Give a peer access to the Docker panel only
tunnelmesh role bind alice panel-viewer --panel-scope docker
```

## Accessing the Panel

The admin dashboard is at `https://this.tm/` from within the mesh. The Docker tab is under the **Data** section. If you can see the mesh visualizer but the Docker tab shows "Access Denied", your peer isn't in `admin_peers` — see the [Admin docs](/docs/ADMIN) for how to configure that.

## Why This Is Useful

The practical case: you have a service container on a remote node that needs a restart, or you want to check its logs to diagnose a problem. Without this, you'd SSH into the machine, run `docker ps`, tail the logs, then SSH into the next machine to check there too.

The mesh already connects all your nodes. The Docker panel uses that connectivity to expose the Docker daemon on each node through the admin API, so you get a single pane across all of them.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
