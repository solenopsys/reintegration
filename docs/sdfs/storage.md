## Storage

The storage system manages cluster data, file systems, data backups, and monitors the usage of disk space and memory. It forms the core of SDFS (Solenopsys Distributed File System).

### Types of Block Devices (Based on Data Type)
- **Global Storage Blocks** (storage uses microblocks of 4K or macroblocks up to 128MB)
- **Event Logs** (storage uses 4K blocks)
- **Database Disk Blocks** (customizable, block size: 8K-32K)

### Disk Partitioning
Disk space is automatically partitioned into segments:
- **Superblock**: 64GB - segment size of sdfs for cold storage
- **Macroblock**: 256MB -  segment size of sdfs for hot storage
- **Microblock**:  4KB-256MB
    - **Cold stoarge**  1MB-8MB (max 256MB ) - multimedia, backups, databases files priority save to (hdd)
    - **Hot storage**:  4KB-1024KB  (max 128MB )- objects and source code priority save to (nvme)

Each block level supports 16-bit addressing for 65536 sub-blocks.

## Superblocks
Cold storage disk space is allocated in superblocks. This size is chosen based on modern disk capacities, write speeds, and network performance in data centers. Block devices are created based on superblocks, and their size can dynamically adjust in increments of 256MB.

## Macroblocks
Macroblocks are virtual blocks used for addressing within block devices. Their size is optimized for maximum HDD performance during random reads and efficient data segmentation for transmission within data centers. For global storage, macroblocks can range from 1MB to 8MB, while for local cluster storage, the size can reach up to 128MB.

## Microblocks
Microblocks are the smallest possible blocks in a block device, optimized for NVMe block sizes.

Each macroblock has a recursive division factor of 1 to 8:
- **Level 1**: 1MB block (This is already a macroblock)
- **Level 8**: 4KB block

### Eviction

During SDFS operation, access statistics are collected for each macroblock. Macroblocks with the largest size and lowest access frequency are offloaded to HDD to optimize storage.



