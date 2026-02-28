# Welcome to the TunnelMesh Blog

This is where we'll post engineering notes, release announcements, and deep-dives on topics like NAT traversal, the Noise protocol, and building mesh networks in Go.

## What to expect

Posts here will generally fall into one of three categories:

- **Release notes**: what changed, why, and what to watch out for when upgrading
- **Engineering deep-dives**: how specific parts of TunnelMesh work under the hood
- **Guides and tutorials**: practical walkthroughs for common deployment scenarios

## Writing a post

Add a markdown file to the `articles/` directory and register it in `articles/manifest.json`:

```json
{
  "slug": "my-post",
  "title": "My Post Title",
  "date": "2026-01-01",
  "author": "Your Name",
  "excerpt": "A one-sentence summary shown on the blog index."
}
```

Set `"draft": true` to hide a post from the index while you're still working on it; it will still be accessible via its direct URL for sharing with reviewers.

Images go in `articles/images/` and are referenced as `images/filename.png`.
