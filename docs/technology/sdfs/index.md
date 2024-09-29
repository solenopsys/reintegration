## SDFS (Solenopsys Distributed File System)

**A modern journaling copy-on-write file system based on B+ trees.** Finely optimized for working with NVMe disks for maximum performance and with HDDs for cold storage of large volumes of data.

The storage system manages cluster data, file systems, backups, and monitors disk space and memory usage. It is the core of SDFS.

### Inspiration and Innovations

**Inspired by IPFS**, adopting many approaches and data storage ideas from it while correcting some weaknesses. SDFS represents a hybrid approach between IPFS and ZFS: it's an optimized analog of IPFS operating at the Linux kernel level with data blocks rather than files.

**Designed for a decentralized environment** with multi-level deduplication. The main difference is the use of data blocks from the working file system for data replication.

### Elimination of Duplication

In traditional IT systems, archives and images are loaded and unpacked, leading to multiple duplications of data. In SDFS, this is eliminated. **All images are stored in segmented form** based on the Slice packaging system, which compresses files at the microblock level. In the case of RAW images where maximum speed is crucial, compression occurs only during data transmission between nodes at the network stack level.

**There is no distinction between archives and working images**—it's a unified structure without information duplication. This allows workloads in the form of images to be instantly transferred to other nodes without additional manipulations, exponentially increasing the platform's bandwidth. All functions are built into the file system and operate at the level of Linux drivers.

## System Architecture

### Metadata and Blocks

**Each block has a hash (SHA256)**, ensuring data integrity, eliminating duplicates, and allowing global block addressing.

**Files are always divided into microblocks.** Unlike IPFS with a fixed block size of 256 KB, in SDFS the microblock size varies from 4 KB to 1024 KB. This reduces the load on the root nodes of the Expansion platform and decreases the volume of stored metadata.

**Microblock composition** is carried out using the Buddy algorithm, commonly used for memory management in Linux. Small microblocks are packed into larger blocks (up to 1024 KB) to optimize storage.

### Disk Partitioning

Disk space is automatically divided into segments:

- **Microblocks** (4 KB–1024 KB): objects and source code with priority storage in hot storage (NVMe).
- **Macroblocks** (1 MB–256 MB): multimedia, backups, database files with priority storage in cold storage (HDD).

Each level supports 8-bit addressing for 256 sub-blocks.

### Hot and Cold Storage

**Hot Storage** is intended for working with NVMe and SD cards. It's used for real-time computational workloads, operating systems, databases, and object storage. Provides random access and full support for Linux file operations. Modern devices have built-in wear-leveling mechanisms and a virtual data mapping layer.

**Cold Storage** stores large blocks grouped into extents. The Buddy algorithm is used to pack extents into sizes that are powers of two. Optimized for storing large volumes of data and accessing them via API rather than through the Linux file system.

### Data Eviction

SDFS collects access statistics for each macroblock. **Macroblocks with the largest size and lowest access frequency** are offloaded to HDD, optimizing storage usage.

## Technological Advantages

### Leveraging Linux and Hardware Capabilities

- **io_uring**: an asynchronous I/O mechanism in Linux that allows sending and receiving I/O requests in batches. Reduces CPU load by decreasing context switches between user space and the kernel.
- **Hardware-accelerated SHA256**: modern processors provide up to 1 GB/s in hashing, sufficient for working with NVMe. This ensures high performance without constant writing of all data.

## Types of Block Devices

- **Global Storage Blocks**
- **Event Logs**
- **Database Disk Blocks**

---

SDFS combines cutting-edge technologies to create an efficient and reliable file system. It eliminates data redundancy, optimizes storage, and delivers high performance in modern computing environments.