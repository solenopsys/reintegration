const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();

    // Путь к блочному устройству
    const device_path = "/dev/nvme0n1p4"; // Замените на путь к вашему устройству

    // Размер блока (например, 512 байт для большинства дисков)
    const block_size: usize = 512;

    // Смещение для чтения (например, начало устройства - 0)
    const offset: u64 = 0;

    // Буфер для хранения прочитанного блока
    var buffer: [512]u8 = undefined;

    // Открытие устройства для чтения
    var file = try std.fs.cwd().openFile(device_path, .{});

    // Чтение данных с устройства
    const bytes_read = try file.pread(buffer[0..], offset);

    // Вывод прочитанных данных в виде байтов
    try stdout.print("Прочитано {} байт из {} байт блока:\n", .{ bytes_read, block_size });
    for (buffer[0..bytes_read]) |byte| {
        try stdout.print("{x} ", .{byte});
    }
    try stdout.print("\n", .{});

    file.close();
}
