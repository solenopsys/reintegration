const std = @import("std");

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    // Открываем файл /proc/partitions
    const file = try std.fs.openFileAbsolute("/proc/partitions", .{});
    defer file.close();

    // Читаем содержимое файла
    const content = try file.readToEndAlloc(allocator, 1024 * 1024); // Максимальный размер 1 МБ
    defer allocator.free(content);

    // Разбиваем содержимое на строки
    var lines = std.mem.split(u8, content, "\n");

    // Пропускаем заголовок
    _ = lines.next();
    _ = lines.next();

    std.debug.print("Логические разделы диска:\n", .{});
    std.debug.print("Major\tMinor\tBlocks\tName\n", .{});

    // Обрабатываем каждую строку
    while (lines.next()) |line| {
        var fields = std.mem.tokenize(u8, line, " \t");

        const major = fields.next() orelse continue;
        const minor = fields.next() orelse continue;
        const blocks = fields.next() orelse continue;
        const name = fields.next() orelse continue;

        std.debug.print("{s}\t{s}\t{s}\t{s}\n", .{ major, minor, blocks, name });
    }
}
