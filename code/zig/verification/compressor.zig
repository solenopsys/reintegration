const std = @import("std");

const Compressor = struct {
    algorithm: []const u8,
    compress: fn (input_stream: std.io.BufferedReader(4096, @TypeOf(std.io.Reader)).Reader, output_stream: std.io.BufferedWriter(4096, @TypeOf(std.io.Writer)).Writer) anyerror!void,
    decompress: fn (input_stream: std.io.BufferedReader(4096, std.io.Reader).Reader, output_stream: std.io.BufferedWriter(4096, std.io.Writer).Writer) anyerror!void,
};

pub fn testCompressor(compressor: *const Compressor) anyerror!void {
    const algorithm = "gzip";

    // Исходные данные для теста
    const input_data = "Hello, this is a test for compression and decompression!";
    var input_stream = std.io.fixedBufferStream(input_data);

    // Буферы для сжатия и разжатия
    var compressed_buf: [1024]u8 = undefined;
    var compressed_output_stream = std.io.fixedBufferStream(&compressed_buf);

    // Сжатие данных
    try compressor.compress(&input_stream.reader(), &compressed_output_stream.writer());

    // Проверка размера сжатых данных
    const compressed_size = compressed_output_stream.writer().bytesWritten();
    std.debug.print("Compressed size: {}\n", .{compressed_size});

    // Подготовка к декомпрессии
    var decompressed_buf: [1024]u8 = undefined;
    var decompressed_output_stream = std.io.fixedBufferStream(&decompressed_buf);
    var compressed_input_stream = std.io.fixedBufferStream(compressed_buf[0..compressed_size]);

    // Декомпрессия данных
    try compressor.decompress(algorithm, &compressed_input_stream.reader(), &decompressed_output_stream.writer());

    // Проверка декомпрессированных данных
    const decompressed_data = decompressed_buf[0..decompressed_output_stream.writer().bytesWritten()];
    std.debug.print("Decompressed data: {}\n", .{decompressed_data});

    if (std.mem.eql(u8, input_data, decompressed_data)) {
        std.debug.print("Test passed: decompressed data matches the original!\n", .{});
    } else {
        std.debug.print("Test failed: decompressed data does not match the original.\n", .{});
    }
}

pub fn main() !void {
    const compressor = Compressor{
        .algorithm = "gzip",
        .compress = compressFunction,
        .decompress = decompressFunction,
    };

    try testCompressor(&compressor);
}

// Реализация функций сжатия и декомпрессии
fn compressFunction(input_stream: anytype, output_stream: anytype) void {
    // Простая заглушка для теста (реальная логика должна быть добавлена)
    const buffer: [1024]u8 = undefined;
    while (true) {
        const read_len = try input_stream.read(buffer[0..]);
        if (read_len == 0) break;
        try output_stream.write(buffer[0..read_len]);
    }
}

fn decompressFunction(input_stream: anytype, output_stream: anytype) void {
    // Простая заглушка для теста (реальная логика должна быть добавлена)
    const buffer: [1024]u8 = undefined;
    while (true) {
        const read_len = try input_stream.read(buffer[0..]);
        if (read_len == 0) break;
        try output_stream.write(buffer[0..read_len]);
    }
}
