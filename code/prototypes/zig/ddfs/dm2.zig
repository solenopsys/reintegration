const std = @import("std");

const linux = std.os.linux;
const ioctl = linux.ioctl;

const DM_VERSION_MAJOR = 4;
const DM_VERSION_MINOR = 0;
const DM_VERSION_PATCHLEVEL = 0;
const DM_NAME_LEN = 128;
const DM_UUID_LEN = 129;
const DM_TYPE_NAME_LEN = 16;

const O_RDWR = std.os.O_RDWR;

const DM_DEV_CREATE = linux._IO('d', 0);
const DM_DEV_REMOVE = linux._IO('d', 5);
const DM_TABLE_LOAD = linux._IO('d', 2);
const DM_DEV_SUSPEND = linux._IO('d', 6);

const DM_SUSPEND_FLAG = 1 << 0;

const ENXIO = linux.ENXIO;

const dm_ioctl = extern struct {
    version: [3]u32,
    data_size: u32,
    data_start: u32,
    target_count: u32,
    open_count: i32,
    flags: u32,
    event_nr: u32,
    padding: u32,
    dev: u64,
    name: [DM_NAME_LEN]u8,
    uuid: [DM_UUID_LEN]u8,
    // Данные продолжаются после этой структуры
};

const dm_target_spec = extern struct {
    sector_start: u64,
    length: u64,
    target_type: [DM_TYPE_NAME_LEN]u8,
    next: u32,
    // Параметры начинаются после этой структуры
};

pub fn main() !void {
    const name = "test1";
    const target_type = "linear";
    const target_args = "/dev/nvme0n1p4 0";

    const allocator = std.heap.page_allocator;

    var fd = try open_control_device();
    defer fd.close();

    try remove_dm_device(fd, name);

    var buffer_size = @sizeOf(dm_ioctl) + @sizeOf(dm_target_spec) + target_args.len + 1;
    var buffer = try allocator.alloc(u8, buffer_size);
    defer allocator.free(buffer);

    try create_dm_device(fd, buffer[0..], name);
    try load_dm_table(fd, buffer[0..], name, target_type, target_args);
    try activate_dm_device(fd, buffer[0..], name);

    std.debug.print("Устройство Device Mapper успешно создано: /dev/mapper/{s}\n", .{name});
}

fn open_control_device() !std.fs.File {
    return std.fs.openZ("/dev/mapper/control", .{ .read = true, .write = true });
}

fn remove_dm_device(fd: std.fs.File, name: []const u8) !void {
    var buffer: [@sizeOf(dm_ioctl)]u8 = undefined;
    std.mem.set(u8, &buffer, 0);

    var dm_ctl = @ptrCast(*dm_ioctl, &buffer[0]);
    init_dm_ioctl(dm_ctl, name);

    const result = ioctl(fd.handle, DM_DEV_REMOVE, dm_ctl);
    if (result != 0) {
        const err = std.os.errno();
        if (err != ENXIO) {
            return linux.linux_errno_to_io_error(err);
        }
    }
}

fn create_dm_device(fd: std.fs.File, buffer: []u8, name: []const u8) !void {
    std.mem.set(u8, buffer, 0);

    var dm_ctl = @ptrCast(*dm_ioctl, &buffer[0]);
    init_dm_ioctl(dm_ctl, name);

    dm_ctl.data_size = @intCast(u32, @sizeOf(dm_ioctl));
    dm_ctl.data_start = 0;

    try ioctl_with_err(fd, DM_DEV_CREATE, dm_ctl);
}

fn load_dm_table(fd: std.fs.File, buffer: []u8, name: []const u8, target_type: []const u8, target_args: []const u8) !void {
    std.mem.set(u8, buffer, 0);

    var dm_ctl = @ptrCast(*dm_ioctl, &buffer[0]);
    init_dm_ioctl(dm_ctl, name);

    var data_start = @sizeOf(dm_ioctl);
    dm_ctl.data_size = @intCast(u32, buffer.len);
    dm_ctl.data_start = @intCast(u32, data_start);

    // Указатель на dm_target_spec внутри буфера
    var tgt = @ptrCast(*dm_target_spec, &buffer[data_start]);
    init_dm_target_spec(tgt, target_type, target_args);

    dm_ctl.target_count = 1;

    try ioctl_with_err(fd, DM_TABLE_LOAD, dm_ctl);
}

fn activate_dm_device(fd: std.fs.File, buffer: []u8, name: []const u8) !void {
    std.mem.set(u8, buffer, 0);

    var dm_ctl = @ptrCast(*dm_ioctl, &buffer[0]);
    init_dm_ioctl(dm_ctl, name);

    dm_ctl.data_size = @intCast(u32, @sizeOf(dm_ioctl));
    dm_ctl.data_start = 0;
    dm_ctl.flags = 0; // Очистка флагов для активации устройства

    try ioctl_with_err(fd, DM_DEV_SUSPEND, dm_ctl);
}

fn init_dm_ioctl(dm_ctl: *dm_ioctl, name: []const u8) void {
    dm_ctl.version = .{ DM_VERSION_MAJOR, DM_VERSION_MINOR, DM_VERSION_PATCHLEVEL };
    dm_ctl.data_size = 0;
    dm_ctl.data_start = 0;
    dm_ctl.target_count = 0;
    dm_ctl.open_count = 0;
    dm_ctl.flags = 0;
    dm_ctl.event_nr = 0;
    dm_ctl.padding = 0;
    dm_ctl.dev = 0;
    std.mem.set(u8, &dm_ctl.name, 0);
    std.mem.copy(u8, dm_ctl.name[0..name.len], name);
    if (name.len < DM_NAME_LEN) dm_ctl.name[name.len] = 0;
    std.mem.set(u8, &dm_ctl.uuid, 0);
}

fn init_dm_target_spec(tgt: *dm_target_spec, target_type: []const u8, target_args: []const u8) void {
    tgt.sector_start = 0;
    tgt.length = (95 * 1024 * 1024) / 512; // 95 МБ в секторах
    std.mem.set(u8, &tgt.target_type, 0);
    std.mem.copy(u8, tgt.target_type[0..target_type.len], target_type);
    if (target_type.len < DM_TYPE_NAME_LEN) tgt.target_type[target_type.len] = 0;
    tgt.next = 0;

    // Указатель на параметры, сразу после структуры tgt
    var params_ptr = @ptrCast([*]u8, @intToPtr(*c_void, @ptrToInt(tgt) + @sizeOf(dm_target_spec)));
    std.mem.copy(u8, params_ptr[0..target_args.len], target_args);
    params_ptr[target_args.len] = 0; // Нуль-терминация параметров
}

fn ioctl_with_err(fd: std.fs.File, request: u32, argp: *anyopaque) !void {
    const result = ioctl(fd.handle, request, argp);
    if (result != 0) {
        return linux.linux_errno_to_io_error(std.os.errno());
    }
}

fn ioctl(fd: std.os.fd_t, request: u32, argp: *anyopaque) c_int {
    return linux.ioctl(fd, request, argp);
}
