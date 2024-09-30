const std = @import("std");

pub fn BlockDeviceInterface(comptime T: type) type {
    return struct {
        fn open(self: *void) !void {
            return T.open(self);
        }

        fn close(self: *void) void {
            return T.close(self);
        }

        fn read(self: *void, offset: u64, buffer: []u8) !usize {
            return T.read(self, offset, buffer);
        }

        fn write(self: *void, offset: u64, buffer: []u8) !usize {
            return T.write(self, offset, buffer);
        }

        fn blockSize(self: *void) !usize {
            return T.blockSize(self);
        }
    };
}

const BlockDevice = struct {
    path: []const u8,
    current: std.File,

    pub fn open(self: *BlockDevice) void {
        self.current = try std.fs.cwd().openFile(self.path, .{});
    }

    pub fn read(self: *BlockDevice, offset: u64, buffer: []u8) !usize {
        return try self.current.pread(buffer[0..], offset);
    }

    pub fn write(self: *BlockDevice, offset: u64, buffer: []u8) !usize {
        return try self.current.pwrite(buffer[0..], offset);
    }

    pub fn close(self: *BlockDevice) void {
        self.current.close();
    }

    pub fn blockSize(self: *BlockDevice) !usize {
        const BLKSSZGET = 0x1268;
        var block_size: usize = 0;
        const result = std.os.ioctl(self.current.handle, BLKSSZGET, &block_size);
        if (result != 0) {
            return error.IoError;
        }
        return block_size;
    }
};
