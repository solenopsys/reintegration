const std = @import("std");

pub fn main() !void {
    const filename = "test.txt";
    var file = try std.fs.cwd().openFile(filename, .{});
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    const BufferSize = 1024; // Размер блока для чтения
    var buffer: [BufferSize]u8 = undefined;

    var total_bytes: usize = 0;
    while (true) {
        const bytes_read = try in_stream.read(&buffer);
        if (bytes_read == 0) break; // Достигнут конец файла

        total_bytes += bytes_read;

        std.debug.print("Прочитано {} байт\n", .{bytes_read});
        // Здесь вы можете обработать прочитанные данные
        // Например, вывести первые несколько байт каждого блока:
        const preview_length = @min(10, bytes_read);
        for (buffer[0..preview_length]) |byte| {
            std.debug.print("{x:0>2} ", .{byte});
        }
        std.debug.print("\n", .{});
    }

    std.debug.print("Всего прочитано {} байт из файла '{}'\n", .{ total_bytes, filename });
}
