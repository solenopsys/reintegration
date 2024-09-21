const std = @import("std");
const os = std.os;
const mem = std.mem;
const fmt = std.fmt;
const fs = std.fs;

const DM_DEV_CREATE: u32 = 0xC138FD00;
const DM_TABLE_LOAD: u32 = 0xC138FD02;
const DM_DEV_SUSPEND: u32 = 0xC138FD06;

const DM_DEVICE_SIZE: usize = 256;
const DM_NAME_LIST_SIZE: usize = 256;

const dm_ioctl = extern struct {
    version: [3]u32,
    data_size: u32,
    data_start: u32,
    target_count: u32,
    open_count: i32,
    flags: u32,
    event_nr: u32,
    dev: u32,
    name: [DM_NAME_LIST_SIZE]u8,
    uuid: [DM_NAME_LIST_SIZE]u8,
    data: [DM_DEVICE_SIZE]u8,
};

fn create_dm_dev(name: []const u8, target_type: []const u8, target_args: []const u8) !void {
    const dm_fd = try fs.cwd().open("/dev/mapper/control", os.O.RDWR, 0);
    defer os.close(dm_fd);

    var dm_ctl = mem.zeroes(dm_ioctl);
    dm_ctl.version = [_]u32{ 4, 0, 0 };
    dm_ctl.data_size = @sizeOf(dm_ioctl);
    dm_ctl.data_start = @sizeOf(dm_ioctl);
    _ = try fmt.bufPrint(&dm_ctl.name, "{s}", .{name});

    const create_result = os.linux.ioctl(dm_fd, DM_DEV_CREATE, @intFromPtr(&dm_ctl));
    if (os.linux.getErrno(create_result) != .SUCCESS) {
        std.debug.print("Failed to create device mapper device. Error: {}\n", .{os.linux.getErrno(create_result)});
        return error.DeviceMapperCreateFailed;
    }

    var table_ctl = dm_ctl;
    const table_entry = try fmt.allocPrint(std.heap.page_allocator, "0 {} {s} {s}", .{ 1024 * 1024 * 100, target_type, target_args });
    defer std.heap.page_allocator.free(table_entry);
    @memcpy(table_ctl.data[0..table_entry.len], table_entry);
    table_ctl.target_count = 1;

    const load_result = os.linux.ioctl(dm_fd, DM_TABLE_LOAD, @intFromPtr(&table_ctl));
    if (os.linux.getErrno(load_result) != .SUCCESS) {
        std.debug.print("Failed to load device mapper table. Error: {}\n", .{os.linux.getErrno(load_result)});
        return error.DeviceMapperTableLoadFailed;
    }

    var suspend_ctl = dm_ctl;
    suspend_ctl.flags = 0;
    const suspend_result = os.linux.ioctl(dm_fd, DM_DEV_SUSPEND, @intFromPtr(&suspend_ctl));
    if (os.linux.getErrno(suspend_result) != .SUCCESS) {
        std.debug.print("Failed to suspend device mapper device. Error: {}\n", .{os.linux.getErrno(suspend_result)});
        return error.DeviceMapperSuspendFailed;
    }

    std.debug.print("Device mapper device created successfully: /dev/mapper/{s}\n", .{name});
}

pub fn main() !void {
    const name = "example_device";
    const target_type = "linear";
    const target_args = "/dev/sda 0";

    try create_dm_dev(name, target_type, target_args);
}
