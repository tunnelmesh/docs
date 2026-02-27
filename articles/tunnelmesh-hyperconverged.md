---
title: "TunnelMesh Is HCI: What Hyperconverged Infrastructure Means for Distributed Systems"
date: 2026-02-27
author: TunnelMesh Team
excerpt: "Hyperconverged infrastructure" sounds like buzzword soup, but the idea behind it is genuinely useful — and TunnelMesh is a pure software expression of that idea for distributed, encrypted networks.
---

# TunnelMesh Is HCI: What Hyperconverged Infrastructure Means for Distributed Systems

Picture this: you have five servers spread across two clouds and a home lab. You need them to talk to each other securely. So you set up WireGuard. Then you realise you need shared object storage, so you install MinIO on one of the servers. Then a service needs filesystem access, so you bolt on NFS. Then you want to see your Docker containers from one place, so you spin up Portainer. Then you need each tool to trust the others somehow, so you start writing glue scripts.

You now have five separate systems, each with their own auth, their own config, their own failure modes. Congratulations — you've reinvented the infrastructure silo problem that the entire data centre industry spent a decade trying to escape.

## The Silo Problem, And How HCI Solved It

For decades, a typical data centre looked like this:

![Three separate silos — Compute managed by VMware, Storage by NetApp, Networking by Cisco — all feeding down into a shared integration layer labeled "your problem now"](/articles/images/infrastructure-silos.svg)

Separate vendor, separate management plane, separate failure domain for each concern. Provisioning a new server meant coordinating three teams and three ticketing systems.

**Hyperconverged infrastructure** (HCI) was the industry's answer. Tools like Nutanix, VMware vSAN, and Azure Stack HCI collapse those three columns into one. Compute, storage, and networking run on the same commodity hardware, managed by a single control plane. You add a node to the cluster, and it automatically joins all three layers.

The key insight isn't "put everything on one machine." It's **eliminate the seams** — the places where separate systems have to negotiate with each other.

## What Gets Converged in Traditional HCI

To understand what TunnelMesh does, it helps to be concrete about what traditional HCI converges:

- **Compute**: VMs or containers that can live-migrate between nodes
- **Storage**: Distributed block/object/file storage that spans the cluster (Nutanix AFS, vSAN datastore)
- **Networking**: Software-defined virtual networks with policy enforcement
- **Identity**: A shared auth system so the same credential works across all layers

Traditional HCI vendors run this on rack-mountable appliances in your data centre. If you want three nodes of redundancy, you buy three appliances. The magic is that they find each other and self-organise; you don't wire them together manually.

## TunnelMesh Does the Same Thing, Differently

TunnelMesh is HCI for distributed, internet-connected infrastructure. The nodes aren't in one rack — they're on different continents, behind NAT, on clouds you don't control. And it's a single binary that costs nothing.

Here's what gets converged:

![TunnelMesh Node: one outer container holding three inner boxes — Networking (encrypted mesh, NAT traversal, DNS, packet filter), Storage (S3 object store, NFS file shares, replication), and Identity & Mgmt (zero-trust RBAC, Noise protocol auth, Docker visibility) — with the caption "One binary · One config · One dashboard · One auth system"](/articles/images/tunnelmesh-hci-converged.svg)

The networking layer (mesh overlay, NAT traversal, DNS) already knows the identity of every peer — it uses the Noise protocol with SSH-derived keys to mutually authenticate before any data flows. The storage layer (S3 and NFS) inherits that trust: when a peer mounts an NFS share, the TLS certificate was issued at mesh join time. No separate credential to provision.

The Docker management panel talks to daemons on remote nodes through the same mesh channels. The packet filter layer decides what traffic is allowed using the same peer identity that the handshake established.

Everything shares the same seam. That's the convergence.

## How It Compares to the Big Names

**Nutanix** and **VMware vSAN** are the gold standard for enterprise HCI. They're excellent if you're in a data centre, running VMware workloads, and have a vendor support contract budget. They're less useful when your "cluster" spans DigitalOcean, AWS, and a Raspberry Pi on your desk.

**Azure Stack HCI** is Microsoft's version — purpose-built hardware running a Hyper-V cluster with Azure-managed control plane. Powerful, but you're committed to the Azure ecosystem and the hardware SKUs they certify.

**K3s/K8s with add-ons** is the DIY path many distributed teams take: Kubernetes for compute, Longhorn or Rook-Ceph for storage, Calico or Cilium for networking, Vault for secrets. That works, but you've just rebuilt the silo problem with open source components. Each layer still has its own auth and its own failure modes.

TunnelMesh isn't trying to replace VM clusters. Its niche is the space where traditional HCI doesn't reach:

![Territory diagram: Traditional HCI confined to one data centre rack on the left, separated by a WAN boundary line, with TunnelMesh peer nodes scattered across EU, US-East, Asia, home lab, and US-West on the right connected by mesh lines](/articles/images/hci-territory.svg)

When your nodes are in different buildings, clouds, or countries, the hardware-appliance model breaks. TunnelMesh was designed to treat WAN latency and NAT as normal operating conditions, not edge cases.

## What HCI Is Actually Good For

The real payoff from converging infrastructure layers is **operational leverage** — fewer systems to reason about means more confidence in what you're changing.

Specifically:

**Provisioning a new node is atomic.** Join the mesh, and the node is immediately reachable, has access to shared storage, and inherits the security policy. There's no "now add it to the NFS export list, now configure MinIO replication, now add it to the Portainer agent list" sequence that you can get half-way through.

**Security policy is coherent.** When the networking layer and the storage layer share an identity model, you can say "peers tagged as `untrusted` get read-only bucket access and no NFS mounts" and have that actually enforced across all layers. With separate systems, policy coherence is aspirational at best.

**Failure modes are predictable.** If the mesh is up, storage is reachable. If a coordinator goes down, the remaining coordinators serve reads from replicated data and the mesh reroutes through the others. You don't have to debug "is this a networking issue or a storage issue?" because they're the same thing.

**HA is a consequence, not a feature you add later.** TunnelMesh's multi-coordinator replication — chunk striping across coordinators, version vectors for conflict resolution, automatic rebalancing when topology changes — isn't a bolt-on. The leaderless architecture is how coordinators work from the start. Add a second coordinator and you have HA; add a third and you have an N+2 cluster.

## The Part Traditional HCI Still Wins On

To be fair: TunnelMesh doesn't do VM live migration, doesn't manage compute scheduling, and isn't a hypervisor. If your workload is "I need to run 500 VMs and migrate them transparently when a host fails," you want Nutanix or vSAN.

What TunnelMesh does is provide the infrastructure substrate that everything else runs on top of — the networking, storage, and identity layer that ties distributed nodes together. You still run your own compute (containers, processes, whatever you like). The HCI aspect is that those three cross-cutting concerns are unified rather than siloed.

## Try It

The best way to see the convergence in practice is to join two machines to a mesh and watch them find shared storage automatically:

```bash
# Start a coordinator on host A
tunnelmesh join --config coordinator.yaml

# Join from host B
tunnelmesh join coordinator.example.com:8443 --token your-token

# From host B — the S3 endpoint is already there
aws s3 --endpoint-url http://coordinator.mesh:8080/s3 ls

# Mount the default file share
sudo mount -t nfs -o vers=3 coordinator.mesh:/shares/default /mnt/mesh
```

Two commands. No separate storage setup. No separate auth configuration. That's the converged part.

The [Getting Started guide](/docs/GETTING_STARTED) walks through the full setup, and the [HA docs](/docs/HIGH_AVAILABILITY) cover adding a second coordinator if you want to see the replication piece in action.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
