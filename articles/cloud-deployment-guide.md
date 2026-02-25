---
title: "Deploying TunnelMesh on AWS, GCP, and Hetzner: A Field Guide"
date: 2026-02-16
author: TunnelMesh Team
excerpt: Practical deployment notes for running TunnelMesh coordinators and nodes on the three cloud providers we use most — with Terraform snippets for each.
---

# Deploying TunnelMesh on AWS, GCP, and Hetzner: A Field Guide

<!-- TODO: Write this post -->
<!-- Tone: practical guide with real commands. Assume the reader can read Terraform and basic cloud console operations. -->

## Why cloud deployment is different

<!-- Cloud-specific considerations: security groups / firewall rules for the coordinator ports, instance IAM roles for S3 backend, metadata service interactions, multi-region latency for coordinators. -->

## Common requirements across all providers

<!-- Ports to open, recommended instance sizes, OS (Ubuntu LTS recommended), kernel requirements for TUN devices. -->

## AWS

<!-- EC2 instance setup, Security Group rules, IAM role for S3 backend, Route53 for coordinator DNS, optional: ALB in front of WebSocket relay. Terraform snippet. -->

## GCP

<!-- Compute Engine, VPC firewall rules, service account for GCS backend (if using GCS as S3-compatible store), Cloud DNS. Terraform snippet. -->

## Hetzner

<!-- Why Hetzner is a great option for TunnelMesh: price/performance, European data sovereignty, Hetzner Cloud Firewall rules, Floating IP for coordinator HA. Terraform snippet. -->

## High availability coordinator setup

<!-- How to run a coordinator behind a load balancer for HA. What state needs to be shared (hint: use the S3 backend). Health check configuration. -->

## Cost estimates

<!-- Rough monthly costs for a small deployment (1 coordinator + 5 nodes) on each provider. Update with current pricing. -->
