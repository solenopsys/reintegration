const std = @import("std");

const Compressor = struct {
    compress: fn (algorithm: []const u8, input_stream: *std.io.Reader, output_stream: *std.io.Writer) void,
    decompress: fn (algorithm: []const u8, input_stream: *std.io.Reader, output_stream: *std.io.Writer) void,
};
