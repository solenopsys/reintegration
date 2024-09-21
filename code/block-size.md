The difference in performance between reading 1 MB blocks versus 4 MB blocks on a modern HDD primarily comes down to how often the head needs to move (seek time) and how much data is read in one go (throughput efficiency).

### Performance Considerations:

1. **Seek Time Impact**:
   - **1 MB Blocks**: More frequent seeks will be required since smaller blocks mean the head moves more often to new positions. Each seek operation can take around 4-10 ms, depending on the drive.
   - **4 MB Blocks**: With larger blocks, fewer seek operations are required, as more data is read in one operation. This reduces the overall time spent seeking, improving performance for scattered data.

2. **Data Transfer Efficiency**:
   - HDDs typically have transfer rates of **100-200 MB/s** for sequential reads. With **1 MB blocks**, the drive spends more time switching between positions compared to the actual data transfer, reducing efficiency.
   - For **4 MB blocks**, the drive can spend more time transferring data once the head is in position, allowing for better throughput and reducing the impact of seek time on performance.

3. **Rotational Latency**:
   - Since modern drives spin at about 7200 RPM, the time waiting for the correct sector to rotate under the read head is roughly 4.16 ms per revolution. Larger blocks like 4 MB reduce the relative frequency of this waiting period compared to smaller blocks.

### Approximate Difference in Performance:

- **With 1 MB blocks**: More frequent seeking leads to reduced effective transfer rates, as seek times (4-10 ms) can dominate, resulting in an effective throughput closer to **50-80 MB/s** for scattered data.
- **With 4 MB blocks**: Less frequent seeks allow for better use of the drive's transfer capabilities, so the effective throughput can approach **120-150 MB/s**, especially for highly scattered data.

Thus, the performance improvement from using **4 MB blocks** over **1 MB blocks** could range from **1.5x to 3x**, depending on the data's location and how often seeks occur.