const std = @import("std");

pub fn makeHash(input: []const u8) [32]u8 {

    // Create a SHA256 hasher
    var hasher = std.crypto.hash.sha2.Sha256.init(.{});

    // Update the hasher with our input
    hasher.update(input);

    // Finalize the hash
    var hash: [32]u8 = undefined;
    hasher.final(&hash);

    return hash;
}
