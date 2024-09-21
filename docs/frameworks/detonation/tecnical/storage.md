## Storage

The storage system manages cluster data, file systems, data backups, and monitors the usage of disk space and memory. It forms the core of DDFS (Detonation Distributed File System).

### Types of Block Devices (Based on Data Type)
- **Global Storage Blocks** (storage uses microblocks of 4K or macroblocks up to 128MB)
- **Event Logs** (storage uses 4K blocks)
- **Database Disk Blocks** (customizable, block size: 8K-32K)

### Disk Partitioning
Disk space is automatically partitioned into segments:
- **Disk Segments**: 256MB-64GB
- **Superblock**: 256MB-32GB
- **Macroblock**: 1MB-128MB
- **Microblock**: 4KB-512KB

Each block level supports 8-bit addressing for 256 sub-blocks.

## Superblocks
Disk space is allocated in superblocks. This size is chosen based on modern disk capacities, write speeds, and network performance in data centers. Block devices are created based on superblocks, and their size can dynamically adjust in increments of 256MB.

## Macroblocks
Macroblocks are virtual blocks used for addressing within block devices. Their size is optimized for maximum HDD performance during random reads and efficient data segmentation for transmission within data centers. For global storage, macroblocks can range from 1MB to 8MB, while for local cluster storage, the size can reach up to 128MB.

## Microblocks
Microblocks are the smallest possible blocks in a block device, optimized for NVMe block sizes.

Each macroblock has a recursive division factor of 1 to 8:
- **Level 1**: 1MB block (This is already a macroblock)
- **Level 8**: 4KB block

### Eviction

During DDFS operation, access statistics are collected for each macroblock. Macroblocks with the largest size and lowest access frequency are offloaded to HDD to optimize storage.


io_uring:
Цель: io_uring — это механизм асинхронного ввода-вывода, представленный в Linux 5.1, который улучшает эффективность системных вызовов, связанных с операциями ввода-вывода (например, файловые операции и сетевые сокеты). Он позволяет отправлять и получать запросы ввода-вывода пакетами, что снижает нагрузку на процессор за счет уменьшения числа переключений контекста между пользовательским и ядром.

Как работает: io_uring предоставляет кольцевые буферы, которые разделяются между пользовательским пространством и ядром. Это позволяет приложениям отправлять сразу несколько операций ввода-вывода без необходимости вызывать системные вызовы для каждой операции, что приводит к меньшей задержке и более высокой производительности.
