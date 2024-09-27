const std = @import("std");

const O_RDWR = 0x0002;
const O_EXCL = 0x0800;
const DM_DEV_CREATE = 0xC138FD01;
const DM_TABLE_LOAD = 0xC138FD03;

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    // Открываем /dev/mapper/control для управления устройствами
    const fd = try std.fs.cwd().openFileZ("/dev/mapper/control", .{ .read = true, .write = true });

    // Создаем структуру для Device Mapper версии
    var version = [3]u32{ 4, 0, 0 }; // Версия Device Mapper

    // Подготовка структуры для запроса
    var dm_ioctl = std.mem.zeroes(DeviceMapperIoctl);
    dm_ioctl.version = version;

    // Создаем блочное устройство (маппинг)
    var table_entry = create_mapping_table(allocator, "/dev/sda", 102400, 204800);

    // Загрузка таблицы с новыми диапазонами
    const result = std.os.linux.ioctl(fd, DM_TABLE_LOAD, &dm_ioctl);
    if (result != 0) {
        std.debug.print("Error while loading table: {d}\n", .{result});
        return;
    }

    std.debug.print("Table loaded successfully!\n", .{});

    // Закрываем дескриптор устройства
    fd.close();
}

fn create_mapping_table(allocator: *std.mem.Allocator, dev: []const u8, start: u64, length: u64) ![]u8 {
    const buf_len = 256;
    var buf: [buf_len]u8 = undefined;
    const writer = std.io.fixedBufferStream(buf[0..]).writer();
    try writer.print("{s} {d} {s} {d} {d}\n", .{ dev, length, "linear", start, length });
    return writer.toOwnedSlice(allocator);
}

const DeviceMapperIoctl = extern struct {
    version: [3]u32, // Версия Device Mapper
    data_size: u32,
    target_count: u32,
    open_count: u32,
    reserved1: [4]u32,
    flags: u32,
    event_nr: u32,
    padding: [24]u8,
};
