const std = @import("std");
const fs = std.fs;
const crypto = std.crypto;

pub fn main() !void {
    const allocator = std.heap.page_allocator;

    // Путь к текущей директории
    var cwd = fs.cwd();

    // Создаём директорию для образа
    try cwd.createDirectory("oci-image", .{ .ignore_if_exists = true });
    const imageDir = try cwd.openDirectory("oci-image", .{});

    // Создаём файл oci-layout
    var layoutFile = try imageDir.createFile("oci-layout", .{ .truncate = true });
    defer layoutFile.close();
    try layoutFile.writeAll(
        \\{
        \\"imageLayoutVersion\\": \\"1.0.0\\"
        \\}.bytes(),
    );

    // Создаём директорию blobs/sha256
    try imageDir.createDirectory("blobs", .{ .ignore_if_exists = true });
    const blobsDir = try imageDir.openDirectory("blobs", .{});
    try blobsDir.createDirectory("sha256", .{ .ignore_if_exists = true });
    const sha256Dir = try blobsDir.openDirectory("sha256", .{});

    // Создаём конфигурационный файл
    const configData = "{ \"architecture\": \"amd64\", \"os\": \"linux\" }".bytes();
    const configDigest = computeDigest(configData);

    var configFile = try sha256Dir.createFile(configDigest, .{ .truncate = true });
    defer configFile.close();
    try configFile.writeAll(configData);

    // Создаём слой (layer)
    const layerData = "Hello, OCI!".bytes();
    const layerDigest = computeDigest(layerData);

    var layerFile = try sha256Dir.createFile(layerDigest, .{ .truncate = true });
    defer layerFile.close();
    try layerFile.writeAll(layerData);

    // Создаём манифест
    const manifest = try std.fmt.allocPrint(
        allocator,
        \\{
            \\"schemaVersion\\": 2,
            \\"config\\": {{
                \\"mediaType\\": \\"application/vnd.oci.image.config.v1+json\\",
                \\"digest\\": \\"sha256:{}\\",
                \\"size\\": {}
            }},
            \\"layers\\": [
                {{
                    \\"mediaType\\": \\"application/vnd.oci.image.layer.v1.tar\\",
                    \\"digest\\": \\"sha256:{}\\",
                    \\"size\\": {}
                }}
            ]
        \\},
        .{ configDigest, configData.len, layerDigest, layerData.len },
    );
    defer allocator.free(manifest);

    const manifestDigest = computeDigest(manifest);

    var manifestFile = try sha256Dir.createFile(manifestDigest, .{ .truncate = true });
    defer manifestFile.close();
    try manifestFile.writeAll(manifest);

    // Создаём index.json
    const index = try std.fmt.allocPrint(
        allocator,
        \\{
            \\"schemaVersion\\": 2,
            \\"manifests\\": [
                {{
                    \\"mediaType\\": \\"application/vnd.oci.image.manifest.v1+json\\",
                    \\"digest\\": \\"sha256:{}\\",
                    \\"size\\": {},
                    \\"annotations\\": {{
                        \\"org.opencontainers.image.ref.name\\": \\"latest\\"
                    }}
                }}
            ]
        \\},
        .{ manifestDigest, manifest.len },
    );
    defer allocator.free(index);

    var indexFile = try imageDir.createFile("index.json", .{ .truncate = true });
    defer indexFile.close();
    try indexFile.writeAll(index);
}

fn computeDigest(data: []const u8) []const u8 {
    var hasher = crypto.sha256.hasher();
    hasher.update(data);
    const digest = hasher.final();

    // Преобразуем хеш в шестнадцатеричную строку
    var digestHex: [crypto.sha256.digest_length * 2]u8 = undefined;
    for (digestHex[0..]) |*c, i| {
        const byte = digest[i / 2];
        const nibble = if (i % 2 == 0) (byte >> 4) else (byte & 0x0F);
        c.* = if (nibble < 10) (nibble + '0') else (nibble - 10 + 'a');
    }
    return digestHex[0..];
}
