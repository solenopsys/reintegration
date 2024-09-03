const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const hwLib = b.addStaticLibrary(.{
        .name = "hw",
        .root_source_file = b.path("src/hw.zig"),
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(hwLib);
}
