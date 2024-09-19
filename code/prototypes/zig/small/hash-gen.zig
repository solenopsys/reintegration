const std = @import("std");
const makeHash = @import("hash.zig").makeHash;

pub fn main() !void {
    // The string we want to hash
    const input = "Hello, Zig!";

    const hash = makeHash(input);

    // Print the hash as a hexadecimal string
    const stdout = std.io.getStdOut().writer();
    try stdout.print("SHA-256 hash of '{s}' is: ", .{input});
    for (hash) |byte| {
        try stdout.print("{x:0>2}", .{byte});
    }
    try stdout.print("\n", .{});
}
