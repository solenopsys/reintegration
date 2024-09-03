const std = @import("std");

const QUICKJS = "src/quickjs";

fn bindQuickjsLibc(step: *std.Build.Step.Compile) void {
    step.addCSourceFiles(.{ .files = &.{
        QUICKJS ++ "/vendor/cutils.c",
        QUICKJS ++ "/vendor/libregexp.c",
        QUICKJS ++ "/vendor/libunicode.c",
        QUICKJS ++ "/vendor/libbf.c",
        QUICKJS ++ "/vendor/quickjs.c",
    }, .flags = &.{
        "-std=gnu99",
        "-funsigned-char",
        "-fno-sanitize=undefined",
    } });

    step.defineCMacro("CONFIG_VERSION", "\"2021-03-27\"");
    step.defineCMacro("CONFIG_BIGNUM", "1");
    step.linkLibC();
}

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{});
    const target = b.standardTargetOptions(.{ .default_target = .{ .cpu_arch = .x86_64, .os_tag = .linux } });

    const exe = b.addExecutable(.{
        .name = "jsruntime",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const quickjsLib = b.addStaticLibrary(.{
        .name = "quickjswrapper",
        .root_source_file = b.path(QUICKJS ++ "/wrapper.zig"),
        .target = target,
        .optimize = optimize,
    });

    bindQuickjsLibc(exe);
    b.installArtifact(quickjsLib);

    exe.linkLibrary(quickjsLib);
    b.installArtifact(exe);
}
