const std = @import("std");
const fs = std.fs;

const DM_DEV_CREATE: usize = 0xfc0c;
const DM_DEV_SUSPEND: usize = 0xfc02;

fn errnoFromSyscall(r: usize) std.os.linux.E {
    const signed_r: isize = @bitCast(r);
    const int = if (signed_r > -4096 and signed_r < 0) -signed_r else 0;
    return @enumFromInt(int);
}

fn create_block_device(fd: i32, start: u64, length: u64) !void {
    var buffer: [1024]u8 = undefined;

    // Create a slice of the array
    const slice: []u8 = buffer[0..];

    // Format the command string
    _ = try std.fmt.bufPrint(slice, "0 {} linear /dev/nvme0n1 {} {}\n", .{ length, start, length });

    // Perform the ioctl call
    const result = std.os.linux.ioctl(fd, DM_DEV_CREATE, @intFromPtr(&slice));

    if (result != 0) {
        std.debug.print("Failed to create device mapper device. Error: {}\n", .{errnoFromSyscall(result)});
        std.debug.print("Failed to create block device\n {}", .{result});
        return error.Failed1;
    }

    std.debug.print("Block device created successfully\n", .{});
}

pub fn main() !void {
    // Open the Device Mapper device
    const dm_device = try fs.cwd().openFile("/dev/mapper/control", .{ .mode = .read_write });
    defer dm_device.close();

    const fd = dm_device.handle;

    // Specify the sector range (in sectors, where 1 sector = 512 bytes)
    const start_sector: u64 = 4096;
    const length_sector: u64 = 4096 * 2;

    // Create a block device for the arbitrary partition range
    try create_block_device(fd, start_sector, length_sector);
}
