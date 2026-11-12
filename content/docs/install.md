---
title: Installation
description: Build Hm from source on macOS, Linux or Windows and install the hm command.
section: Getting started
order: 2
---

Prebuilt, signed releases for macOS, Linux and Windows are planned. Until then, Hm is built from source. You need [Go](https://go.dev/dl/) (see `go.mod` for the version) and git.

## Build from source

```sh
git clone https://github.com/usehm/hm.git
cd hm
make run            # run from source in the current folder
```

`make run` starts Hm on the folder you are in. The other targets:

```sh
make test           # run the tests
make install_deps   # install the yoga CLI used for packaging
make app            # build Hm.app and a DMG into dist/darwin
make install        # build Hm.app, copy it to /Applications and install `hm`
```

## macOS

```sh
make install_deps
make install
```

This builds an unsigned (ad-hoc signed) `Hm.app` for your Mac's architecture, copies it to `/Applications` and installs the `hm` shell command. A local build reports its version as `dev`, so it never offers to update itself.

Inside the app, **Install 'hm' Command in PATH** from the command palette does the last step on its own.

## Linux and Windows

The packaging targets build an archive for each platform with the yoga CLI:

```sh
make install_deps
make build_linux     # tar.xz in dist/linux
make build_windows   # amd64 build in dist/windows
```

On Linux, pasting images into the agent's message box needs `wl-paste` (Wayland) or `xclip` (X11).

## Open a folder

```sh
hm .                 # open the current folder
hm ~/src/project     # or any other
```

Next: [configure the editor and add a provider](/docs/configuration/).
