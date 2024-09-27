const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();

    // Укажите путь к устройству (например, /dev/sda)
    const device_path = "/dev/sda";

    // Открыть устройство
    const file = try std.fs.cwd().openFile(device_path, .{});
    defer file.close();

    // Получить размер блока устройства
    const block_size = try getBlockSize(file.handle);

    // Вывести размер блока устройства
    try stdout.print("Размер блока устройства: {} байт\n", .{block_size});
}

fn getBlockSize(file_handle: std.fs.File.Handle) !usize {

    // Определить структуру для ioctl
    const BLKSSZGET = 0x1268; // Команда ioctl для получения размера блока
    var block_size: usize = 0;

    // Выполнить ioctl
    const result = std.os.ioctl(file_handle, BLKSSZGET, &block_size);
    if (result != 0) {
        return error.IoError;
    }

    return block_size;
}
