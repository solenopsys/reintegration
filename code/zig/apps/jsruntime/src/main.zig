const std = @import("std");

const quickjs = @import("quickjswrapper");

pub fn main() anyerror!void {
    const n = quickjs.zig_eval("1 + 2*100");
    std.debug.print("sum: {s}\n", .{n});
}
