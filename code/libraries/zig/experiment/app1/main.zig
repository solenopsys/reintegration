const std = @import("std");

extern fn zig_eval(buf: []const u8) []const u8;

pub fn main() anyerror!void {
    const n = zig_eval("1 + 2*100");
    std.debug.print("sum: {s}\n", .{n});
}
