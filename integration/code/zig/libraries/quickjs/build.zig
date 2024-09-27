const std = @import("std");


        fn undefinedBuild(step: *std.Build.Step.Compile, optimize: any, target:any) Lib {
          
            step.addCSourceFiles(.{ .files = &.{
                "./src/vendor/cutils.c",
"./src/vendor/libregexp.c",
"./src/vendor/libunicode.c",
"./src/vendor/libbf.c",
"./src/vendor/quickjs.c"
            }, .flags = &.{
                "std=gnu99",
"funsigned-char",
"fno-sanitize=undefined"
            } });

            step.defineCMacro("CONFIG_VERSION", "2021-03-27");
step.defineCMacro("CONFIG_BIGNUM", "1");

            step.linkLibC();

            const quickjsLib = b.addStaticLibrary(.{
                .name = "undefined",
                .root_source_file = b.path("./src/wrapper.zig"),
                .target = target,
                .optimize = optimize,
            });

            return quickjsLib; 
        }

