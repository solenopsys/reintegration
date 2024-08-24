const std = @import("std");

fn bindQuickjsLibc(step: *std.Build.Step.Compile) void {
    step.addCSourceFiles(.{
        .files = &.{
            "src/vendor/cutils.c",
            "src/vendor/libregexp.c",
            "src/vendor/libunicode.c",
            "src/vendor/libbf.c",
            "src/vendor/quickjs.c",
        },
        .flags = &.{
            "-std=gnu99",
            "-funsigned-char",
            "-fno-sanitize=undefined",
        },
    });
    step.defineCMacro("CONFIG_VERSION", "\"2021-03-27\"");
    step.defineCMacro("CONFIG_BIGNUM", "1");
    step.linkLibC();
}

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{});

    // Изменяем цель на создание библиотеки
    const target = b.standardTargetOptions(.{ .default_target = .{ .cpu_arch = .x86_64, .os_tag = .linux } });

    // Создаем библиотеку вместо исполняемого файла
    const lib = b.addStaticLibrary(.{
        .name = "quickjs",
        .root_source_file = b.path("src/quickjs.zig"),
        .target = target,
        .optimize = optimize,
    });
    bindQuickjsLibc(lib);
    b.installArtifact(lib);
}
