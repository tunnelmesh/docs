---
title: "Docker Integration: Containers as First-Class Mesh Citizens"
date: 2025-12-08
author: TunnelMesh Team
excerpt: With Docker integration, containers on the mesh get automatic port-forward rules, mesh DNS, and the same zero-trust filtering as bare-metal nodes.
---

# Docker Containers Are Now First-Class Citizens in TunnelMesh

<!-- TODO: Write this post -->
<!-- Tone: feature announcement + practical guide. Start with the user problem, end with a quick demo. -->

## The problem with containers and mesh networks

<!-- Before this: containers run in their own network namespace, didn't inherit TUN routes, no mesh DNS for containers, had to manually configure port-forwards. -->

## What we built

<!-- Overview of the Docker integration: automatic detection of running containers, port-forward rule injection, mesh DNS entries for containers, lifecycle hooks on start/stop. -->

## How it works under the hood

<!-- Docker socket event listening, netfilter/iptables rules for port-forwards, how container IPs get published to the coordinator, DNS record management. -->

## Setting it up

<!-- Step-by-step: enabling Docker integration in coordinator.yaml / node config. What labels/compose options are available. A docker-compose.yml example. -->

## Demo: a containerised web service on the mesh

<!-- Walk through deploying a simple service and accessing it from another node by name. -->

## What's not supported yet

<!-- Kubernetes, Podman, rootless Docker caveats, IPv6 containers. Be honest about current limitations. -->
