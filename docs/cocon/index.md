## Cocon OS

**An ultra-compact, immutable operating system comparable in size to Alpine Linux.** It is a thin, monolithic shell without unnecessary components, wrapping workloads in a protective cocoon.

**Specifically designed for deployment with a minimal footprint** on $10 microcomputers included in the Combinator, on cloud platforms within free usage tiers, or as a base OS for containers in detonation clusters.

**The system is built from source code using a concept similar to the Yocto project**, aiming for the same goals: creating fully custom, minimalist operating systems for embedded devices with a minimal kernel and a set of libraries tailored to specific tasks.

## Differences from Other Systems

### Build System

Unlike Yocto, it uses its own build system based on OCI image layers. The base build configuration allows fine-tuning of build stages using a TypeScript-based tool.

For example, the kernel layer is taken first, and then each subsequent library adds its own layer. This creates a tree-like build structure with reuse of already built libraries.

### Package System

Packages are stored on the decentralized platform Expansion and are created using the standard Slice system. A single configuration point based on a TypeScript config wraps standard package settings and integrates closely with the OS build configuration, allowing precise control over the build parameters of individual packages according to kernel settings.

### Bootloader

A custom bootloader provides instant kernel switching. Using the SDFS file system, it allows quick transitions to a new version and automatic rollback in case of failure.

**Designed for maximum configurability for specific hardware, reliability, and security.** The system is immutable: you cannot install additional packages or programs; all workloads run in containers. Updates occur by switching to a new kernel. Each new version is tested before being placed in the repository and is optimized for specific hardware or tasks.

**Cocon OS is highly flexible, fully built from source, and supports various configuration types:**

- **Embedded** — for operation on Combinator hardware.
- **Cloud** — for operation in cloud environments.
- **Edge** — for operation in containers on real microcomputers.
- **Desktop** — for deployment on Combinator hardware with a screen (uses the Converged interface).