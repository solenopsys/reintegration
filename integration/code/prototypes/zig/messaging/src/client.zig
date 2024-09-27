const std = @import("std");
const net = std.net;
const print = std.debug.print;

pub fn main() !void {
    var args = std.process.args();
    // The first (0 index) Argument is the path to the program.
    _ = args.skip();

    const peer = try net.Address.parseIp4("0.0.0.0", 3667);
    // Connect to peer
    const stream = try net.tcpConnectToAddress(peer);
    defer stream.close();
    print("Connecting to {}\n", .{peer});

    // Sending data to peer
    const data = "hello zig\n";
    var writer = stream.writer();
    // loop 100
    for (0..100000) |_| {
        _ = try writer.write(data);
        //   print("Sending '{s}' to peer, total written: {d} bytes\n", .{ data, size });
    }

    // Or just using `writer.writeAll`
    // try writer.writeAll("hello zig");
}
