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

        fn deviceSize(self: *void) !usize {
            return T.deviceSize(self);
        }
    };
}
