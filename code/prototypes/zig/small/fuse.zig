const std = @import("std");

const Fuse = std.os.fu
const mem = std.mem;
const fs = std.fs;

const allocator = mem.page_allocator;

const FileSystem = struct {
    files: []const [:0]u8,
};

fn fileSystemInit(comptime files: []const [:0]u8) FileSystem {
    return FileSystem{
        .files = files,
    };
}

fn fileSystemGetAttr(path: []const u8, attr: *Fuse.FileAttr) !void {
    const file = fs.files.get(path);
    if (file) |file| {
        attr.size = file.len;
        attr.mode = Fuse.S_IFREG | 0o644; // Regular file with permissions 0644
        return;
    } else {
        return error.FileNotFound;
    }
}

fn fileSystemRead(path: []const u8, offset: usize, size: usize, buf: *u8) !usize {
    const file = fs.files.get(path);
    if (file) |file| {
        const len = file.len;
        if (offset >= len) return 0;
        const read_size = std.math.min(size, len - offset);
        mem.copy(u8, buf, file[offset..(offset + read_size)]);
        return read_size;
    } else {
        return error.FileNotFound;
    }
}

pub fn main() !void {
    const fs1 = fileSystemInit(&[_][]const u8{
        "hello.txt",
        "world.txt",
    });

    const fuse_ops = Fuse.Operations{
        .getattr = fileSystemGetAttr,
        .read = fileSystemRead,
    };

    const args = Fuse.Args.init(allocator);
    defer args.deinit();
    try args.add("-o", "default_permissions");

    const fuse = try Fuse.init(args, &fuse_ops, &fs);
    defer fuse.deinit();

    try fuse.main();
}
