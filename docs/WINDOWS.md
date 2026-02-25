# Windows Client Guide

> [!NOTE]
> The Windows client works, but it's second-class compared to the Linux and macOS clients. This page is honest about the rough edges and what to expect. Windows users are keeping us accountable — please [file issues](https://github.com/tunnelmesh/tunnelmesh/issues) for anything you hit.

## Installation

Download the Windows binary from the [GitHub releases page](https://github.com/tunnelmesh/tunnelmesh/releases). There are two files:

- `tunnelmesh-windows-amd64.exe` — the main binary
- `tunnelmesh-service-installer.exe` — installs TunnelMesh as a Windows service

### Service Installer

The service installer registers TunnelMesh with the Windows Service Control Manager so it starts automatically on boot:

```powershell
# Run as Administrator
.\tunnelmesh-service-installer.exe install --config C:\tunnelmesh\config.yaml

# Start the service
sc start tunnelmesh

# Check status
sc query tunnelmesh
```

To uninstall:

```powershell
sc stop tunnelmesh
.\tunnelmesh-service-installer.exe uninstall
```

### Manual (No Service)

You can also run the binary directly without the service installer, which is useful for testing:

```powershell
.\tunnelmesh-windows-amd64.exe join coordinator.example.com:8443 --token your-token
```

---

## TUN Driver: Wintun

On Linux and macOS, TunnelMesh uses the kernel's built-in TUN interface. On Windows, the kernel doesn't expose a TUN device the same way, so TunnelMesh uses **[Wintun](https://www.wintun.net/)** — a userspace TUN driver maintained by the WireGuard project.

Wintun ships bundled with the Windows binary (`wintun.dll`). Keep the DLL in the same directory as the executable.

> [!WARNING]
> Wintun requires administrator privileges to create a network adapter. The TunnelMesh service runs as `LocalSystem` by default, which has the required privileges. If you're running the binary manually, open your terminal as Administrator.

The Wintun code path is separate from the Linux TUN code path. It behaves the same at the network level — packets go in, packets come out — but the implementation is different, which means:

- Bugs that only appear on Windows may not reproduce on Linux
- Performance characteristics differ slightly from the Linux TUN path
- If you see TUN-related errors on Windows, check the [GitHub issues](https://github.com/tunnelmesh/tunnelmesh/issues) filtered by `windows` before filing a new one

---

## DNS Resolution

On Linux and macOS, TunnelMesh installs a local DNS resolver that intercepts `.tunnelmesh` queries. On Windows, this integration is rougher.

**Current behavior**: TunnelMesh writes entries to the Windows hosts file (`C:\Windows\System32\drivers\etc\hosts`) for each known mesh peer. This means:

- `ping coordinator.tunnelmesh` works
- `curl https://this.tm/` works
- New peers added to the mesh won't resolve until TunnelMesh updates the hosts file (happens on the next heartbeat cycle, usually within 30 seconds)
- Peers that leave the mesh may still resolve for up to one heartbeat cycle

### Workarounds

If hosts-file DNS is causing problems, you can:

**Option 1: Use mesh IPs directly**

```powershell
# Find the mesh IP for a peer
tunnelmesh-windows-amd64.exe resolve coordinator
# Output: 10.0.0.1
```

**Option 2: Point a local DNS server at the coordinator**

If you control your local DNS (e.g., you're running Pi-hole), you can add a conditional forwarder for `tunnelmesh` that points to the coordinator's mesh IP on port 5353:

```
# In Pi-hole / dnsmasq
server=/tunnelmesh/10.0.0.1#5353
```

This gives you proper dynamic DNS resolution instead of relying on the hosts file.

> [!NOTE]
> Proper Windows DNS integration (via DNS Client service or a custom DNS provider) is on the roadmap. The hosts-file approach is a temporary workaround.

---

## Service Management

On Linux you'd use `systemctl`; on macOS, `launchctl`. On Windows, use the Service Control Manager or PowerShell:

```powershell
# Start / stop / restart
sc start tunnelmesh
sc stop tunnelmesh
sc stop tunnelmesh; sc start tunnelmesh

# Check status
sc query tunnelmesh

# View recent logs (Event Viewer)
Get-EventLog -LogName Application -Source tunnelmesh -Newest 50

# Or if you've configured file logging in config.yaml:
Get-Content C:\tunnelmesh\logs\tunnelmesh.log -Wait
```

### Log Configuration

Add a `log_file` to your config to write logs to a file instead of (or in addition to) the Event Log:

```yaml
# config.yaml
name: "my-peer"
log_level: "info"
# log_file: "C:\\tunnelmesh\\logs\\tunnelmesh.log"  # Uncomment to enable file logging
```

---

## Known Limitations and Rough Edges

| Issue | Status | Workaround |
| --- | --- | --- |
| DNS via hosts file only | Known, roadmap | Use mesh IPs directly or local DNS forwarder |
| Wintun requires admin rights | By design | Run service as LocalSystem (default) |
| Service installer is not signed | Known | You'll see a SmartScreen warning — dismiss and run anyway |
| No MSI/WinGet package yet | Roadmap | Manual download from GitHub releases |
| Windows Firewall may block TUN | Known | Add inbound rule for the tunnelmesh adapter |
| Ctrl+C in PowerShell sometimes leaves adapter up | Known | `sc stop tunnelmesh` to clean up |

### Windows Firewall

If peers can't reach you on Windows, the Windows Firewall may be blocking inbound connections on the mesh adapter. Add an inbound rule:

```powershell
# Allow all inbound on the TunnelMesh adapter (run as Administrator)
New-NetFirewallRule -DisplayName "TunnelMesh" `
  -Direction Inbound `
  -InterfaceAlias "TunnelMesh" `
  -Action Allow
```

---

## Reporting Windows-Specific Issues

Windows bugs are worth filing even if you're not sure they're bugs — the issue tracker helps us track platform coverage. When filing:

1. Include your Windows version (`winver` output)
2. Attach the service logs or a `tunnelmesh-windows-amd64.exe status` output
3. Label the issue with `windows`

[Open an issue on GitHub](https://github.com/tunnelmesh/tunnelmesh/issues/new)

---

*TunnelMesh is released under the [AGPL-3.0 License](https://github.com/tunnelmesh/tunnelmesh/blob/main/LICENSE).*
