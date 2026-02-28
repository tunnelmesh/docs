---
title: "Deploying TunnelMesh on DigitalOcean with Terraform"
date: 2026-02-16
author: TunnelMesh Team
excerpt: A field guide to the six Terraform deployment scenarios, from a $4/month single-node setup to a multi-region mesh with monitoring, exit peers, and HA coordinators.
---

# Deploying TunnelMesh on DigitalOcean with Terraform

TunnelMesh ships Terraform modules for DigitalOcean. You pick a deployment scenario, fill in a `tfvars` file, and `terraform apply` handles the rest: droplet provisioning, firewall rules, DNS, and TunnelMesh configuration.

## Prerequisites

- Terraform ≥ 1.0
- A DigitalOcean account and API token
- A domain (for the coordinator DNS record)
- An SSH key added to your DigitalOcean account

```bash
export DIGITALOCEAN_TOKEN=your-api-token
export TF_VAR_ssh_key_name=your-key-name
export TF_VAR_domain=yourdomain.com
```

## Quick Start

```bash
git clone https://github.com/tunnelmesh/tunnelmesh
cd tunnelmesh/terraform

cp scenarios/all-in-one/terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set your domain, region, and token

terraform init
terraform apply
```

Terraform outputs the coordinator URL, your mesh token, and admin credentials. Run `tunnelmesh join` from any other machine to add it.

## The Six Scenarios

**1. All-in-One (Starter)**
Coordinator + one peer + monitoring on a single `s-1vcpu-1gb` droplet (~$4/month). Good for trying things out or small personal meshes. Not for production; it is a single point of failure.

**2. Exit Peer (Split-Tunnel VPN)**
Coordinator plus an exit peer in a specific region. Traffic from your devices routes through that exit peer. Use this for a stable outbound IP, or to protect traffic on untrusted WiFi.

![Exit peer flow: your laptop sends encrypted traffic to exit peer, which forwards to Internet](/articles/images/exit-peer-flow.svg)

**3. Multi-Region Mesh**
Coordinator in one region, peers in several others. Mesh DNS handles routing between them. Useful when you have services in multiple regions and want them to communicate privately without crossing the public internet.

**4. Home Lab Gateway**
The coordinator is internet-facing. Your home lab runs a peer connecting outbound to it. Services on your home network become accessible by mesh IP from anywhere, with no port-forwarding on your home router required.

**5. Development Team Secure Mesh**
Each developer's laptop joins a shared mesh. Direct P2P connections between developers, shared S3 buckets for build artifacts, NFS for shared assets, packet filter rules that prevent anyone from accidentally reaching production.

**6. Gaming Group Low-Latency Mesh**
Coordinator in a region geographically central to the group. Direct peer connections only; WebSocket relay is disabled to avoid latency overhead. UDP tunnels with minimal overhead for game traffic.

## Monitoring Stack

All scenarios except the starter include Prometheus + Grafana + Loki:

```hcl
enable_monitoring = true
```

Pre-configured dashboards cover peer connection status, throughput and latency per peer pair, packet filter allow/deny rates, and coordinator health. The monitoring stack runs on a separate droplet; include it in the cost estimate.

## Cost Reference

Rough monthly estimates (DigitalOcean pricing, subject to change):

| Configuration | ~Cost/month |
|---|---|
| All-in-one (`s-1vcpu-1gb`) | $4 |
| Coordinator + 2 peers | $12 |
| Multi-region, 5 nodes | $20 |
| + Monitoring (`s-2vcpu-4gb`) | +$24 |

Bandwidth costs extra. If your coordinator is handling a lot of WebSocket relay traffic, factor in DigitalOcean's bandwidth pricing.

## Managing Your Deployment

```bash
# See what's running
terraform output

# View coordinator logs
ssh coordinator "journalctl -u tunnelmesh -f"

# Update to a new version
# Edit the image tag in variables.tf, then:
terraform apply
```

See the [Cloud Deployment docs](/docs/CLOUD_DEPLOYMENT) for the full variable reference, HA coordinator setup, and teardown instructions.

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
