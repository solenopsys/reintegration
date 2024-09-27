import type { CLibrary } from "./types";

export function genHeader(): string {
   return "const std = @import(\"std\");\n\n"
}


export function genLib(config: CLibrary, relativePath:string): string {
    const sources = config.sources.map(src => `"${relativePath}/${src}"`).join(",\n");
    const flags = config.flags.map(flag => `"${flag}"`).join(",\n");
    const macros = Object.keys(config.macros)
        .map(key => `step.defineCMacro("${key}", "${config.macros[key]}");`)
        .join("\n");

    const lib = `
        fn ${config.name}Build(step: *std.Build.Step.Compile, optimize: any, target:any) Lib {
          
            step.addCSourceFiles(.{ .files = &.{
                ${sources}
            }, .flags = &.{
                ${flags}
            } });

            ${macros}

            step.linkLibC();

            const quickjsLib = b.addStaticLibrary(.{
                .name = "${config.name}",
                .root_source_file = b.path("${relativePath}/${config.rootSourceFile}"),
                .target = target,
                .optimize = optimize,
            });

            return quickjsLib; 
        }

`;
    return lib;
}

function optimize(): string {
    const code = `
    const optimize = b.standardOptimizeOption(.{});
    const target = b.standardTargetOptions(.{ .default_target = .{ .cpu_arch = .x86_64, .os_tag = .linux } });
`
    return code;
}


function genExe(config: CLibrary): string { 

    const optimizeConsts=optimize()
    const lib = `
       

   pub fn build(b: *std.Build) void {

   ${optimizeConsts}
       const exe = b.addExecutable(.{
           .name = "my_executable",
           .root_source_file = b.path("src/main.zig"),
           .target = b.standardTargetOptions(.{}).default_target,
           .optimize = b.standardOptimizeOption(.{}),
       });

        exe.linkLibrary(quickjsLib);
       bindQuickjsLibc(exe);

       b.installArtifact(exe);
   }
       `;
       return lib
}