const std = @import("std");

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{});

    //const optimize = b.standardOptimizeOption(.{});
    const target = b.standardTargetOptions(.{ .default_target = .{ .cpu_arch = .x86_64, .os_tag = .linux } });

    const exe = b.addExecutable(.{
        .name = "my_executable",
        .root_source_file = b.path("app1/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const lib = exe.addStaticLibrary(.{
        .name = "hw", // Имя библиотеки, без префикса 'lib' и расширения '.a'
        .path = "lib1/zig-out/lib/libhw.a", // Путь к вашей статической библиотеке
    });

    //  b.installArtifact(lib);

    exe.linkLibrary(lib);

    // Укажите необходимые зависимости, если такие есть
    // exe.linkSystemLibrary("c"); // например, если требуется стандартная библиотека C

    b.installArtifact(exe);
}
