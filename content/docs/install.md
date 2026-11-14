---
title: Installation
description: Install Hm with Homebrew or a download for macOS, Linux and Windows, or build it from source.
section: Getting started
order: 2
---

## macOS

With [Homebrew](https://brew.sh):

```sh
brew install --cask usehm/tap/hm
```

This installs `Hm.app` and the `hm` command. Or download the DMG for your Mac from the [latest release](https://github.com/usehm/hm/releases/latest): `arm64` for Apple silicon, `amd64` for Intel. Both are signed and notarized.

## Linux

Download `hm-linux-<version>-amd64.tar.xz` or `-arm64.tar.xz` from the [latest release](https://github.com/usehm/hm/releases/latest) and unpack it. Pasting images into the agent's message box needs `wl-paste` (Wayland) or `xclip` (X11).

## Windows

Download `hm-windows-<version>-amd64.zip` from the [latest release](https://github.com/usehm/hm/releases/latest) and unzip it. It runs on Windows on ARM too, emulated. The build isn't code-signed yet, so SmartScreen may warn on first run: choose **More info → Run anyway**.

## Updates

Hm checks for updates and installs them from inside the app, checking each download's signature first. Homebrew installs update with `brew upgrade --cask hm`. To get prereleases too, set:

```yaml
updates:
  channel: prerelease   # stable | prerelease | off
```

## Build from source

You need [Go](https://go.dev/dl/) (see `go.mod` for the version) and git.

```sh
git clone https://github.com/usehm/hm.git
cd hm
make run            # run from source in the current folder
make test           # run the tests
```

To package it, install the yoga CLI first:

```sh
make install_deps
make install         # macOS: build Hm.app, copy it to /Applications and install `hm`
make build_linux     # tar.xz in dist/linux
make build_windows   # amd64 build in dist/windows
```

A local build reports its version as `dev`, so it never offers to update itself.

## Open a folder

```sh
hm .                 # open the current folder
hm ~/src/project     # or any other
```

Next: [configure the editor and add a provider](/docs/configuration/).
