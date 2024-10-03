const std = @import("std");
const device = @import("device.zig");

pub fn BlockBufferedInterface(
    comptime T: type,
) type {
    return struct {
        fn init(blockDevice: device.BlockDeviceInterface, allocator: *std.mem.Allocator, path: []const u8, block_size: usize) !void {
            return T.init(blockDevice, allocator, path, block_size);
        }
        fn readBlock(self: *void, allocator: *std.mem.Allocator, block_number: u64) ![]u8 {
            return T.readBlock(self, allocator, block_number);
        }
        fn removeBlock(self: *void, allocator: *std.mem.Allocator, block_number: u64) !void {
            return T.removeBlock(self, allocator, block_number);
        }
    };
}

const BlockDeviceBuffered = struct {
    device: device.BlockDeviceInterface, // базовое блочное устройство
    block_size: usize, // размер одного блока
    cache: std.AutoHashMap(u64, []u8), // кэш блоков по их номерам
    allocator: *std.mem.Allocator,

    pub fn init(
        blockDevice: device.BlockDeviceInterface,
        allocator: *std.mem.Allocator,
        block_size: usize,
    ) !BlockDeviceBuffered {
        try device.open();

        return BlockDeviceBuffered{
            .device = blockDevice,
            .block_size = block_size,
            .cache = std.AutoHashMap(u64, []u8).init(allocator),
        };
    }

    // Освобождение ресурсов
    pub fn deinit(self: *BlockDeviceBuffered, allocator: *std.mem.Allocator) void {
        self.device.close();
        // Освобождение каждого блока в кэше
        var it = self.cache.iterator();
        while (it.next()) |entry| {
            allocator.free(entry.value);
        }
        self.cache.deinit();
    }

    // Отдельная функция для загрузки блока в кэш
    fn loadBlock(self: *BlockDeviceBuffered, block_number: u64) ![]u8 {
        var buffer = try self.allocator.alloc(u8, self.block_size);
        const offset = block_number * @intCast(u64, self.block_size);
        const bytes_read = try self.device.read(offset, buffer);

        if (bytes_read != self.block_size) {
            allocator.free(buffer);
            return error.IncompleteBlockRead;
        }

        // Сохраняем блок в кэше
        self.cache.put(block_number, buffer) catch |e| {
            allocator.free(buffer);
            return e;
        };

        return buffer;
    }

    // Буферизированное чтение данных по номеру блока
    pub fn readBlock(self: *BlockDeviceBuffered, block_number: u64) ![]u8 {
        // Проверка, есть ли блок в кэше
        if (self.cache.get(block_number)) |cached_block| {
            return cached_block;
        } else {
            // Если блок не найден, загружаем его
            return try self.loadBlock(self.allocator, block_number);
        }
    }

    // Явное удаление блока из кэша
    pub fn removeBlock(self: *BlockDeviceBuffered, allocator: *std.mem.Allocator, block_number: u64) !void {
        if (self.cache.remove(block_number)) |cached_block| {
            allocator.free(cached_block);
        }
    }
};
