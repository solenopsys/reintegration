import { promises as fs } from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import * as tar from 'tar-stream';

async function main() {
  const imageDir = path.join(process.cwd(), 'oci-image');

  // Создаём директорию для образа
  await fs.mkdir(imageDir, { recursive: true });

  // Создаём файл oci-layout
  const ociLayout = {
    imageLayoutVersion: '1.0.0',
  };
  await fs.writeFile(
    path.join(imageDir, 'oci-layout'),
    JSON.stringify(ociLayout, null, 2),
  );

  // Создаём директорию blobs/sha256
  const blobsDir = path.join(imageDir, 'blobs', 'sha256');
  await fs.mkdir(blobsDir, { recursive: true });

  // Создаём конфигурационный файл
  const configData = {
    architecture: 'amd64',
    os: 'linux',
    rootfs: {
      type: 'layers',
      diff_ids: [],
    },
    config: {},
  };
  const configJson = JSON.stringify(configData, null, 2);
  const configBuffer = Buffer.from(configJson, 'utf-8');
  const configDigest = sha256(configBuffer);

  await fs.writeFile(
    path.join(blobsDir, configDigest),
    configBuffer,
  );

  // Создаём слой (layer) в формате tar
  const layerContent = 'Hello, OCI!';
  const layerTar = await createTarLayer({ 'hello.txt': layerContent });
  const layerDigest = sha256(layerTar);

  await fs.writeFile(
    path.join(blobsDir, layerDigest),
    layerTar,
  );

  // Обновляем конфигурацию с hash слоя
  configData.rootfs.diff_ids.push(`sha256:${sha256(Buffer.from(layerContent, 'utf-8'))}`);
  const updatedConfigJson = JSON.stringify(configData, null, 2);
  const updatedConfigBuffer = Buffer.from(updatedConfigJson, 'utf-8');
  const updatedConfigDigest = sha256(updatedConfigBuffer);

  // Перезаписываем конфигурационный файл с обновлёнными данными
  await fs.writeFile(
    path.join(blobsDir, updatedConfigDigest),
    updatedConfigBuffer,
  );

  // Создаём манифест
  const manifest = {
    schemaVersion: 2,
    mediaType: 'application/vnd.oci.image.manifest.v1+json',
    config: {
      mediaType: 'application/vnd.oci.image.config.v1+json',
      digest: `sha256:${updatedConfigDigest}`,
      size: updatedConfigBuffer.length,
    },
    layers: [
      {
        mediaType: 'application/vnd.oci.image.layer.v1.tar',
        digest: `sha256:${layerDigest}`,
        size: layerTar.length,
      },
    ],
  };
  const manifestJson = JSON.stringify(manifest, null, 2);
  const manifestBuffer = Buffer.from(manifestJson, 'utf-8');
  const manifestDigest = sha256(manifestBuffer);

  await fs.writeFile(
    path.join(blobsDir, manifestDigest),
    manifestBuffer,
  );

  // Создаём index.json
  const index = {
    schemaVersion: 2,
    mediaType: 'application/vnd.oci.image.index.v1+json',
    manifests: [
      {
        mediaType: 'application/vnd.oci.image.manifest.v1+json',
        digest: `sha256:${manifestDigest}`,
        size: manifestBuffer.length,
        annotations: {
          'org.opencontainers.image.ref.name': 'latest',
        },
      },
    ],
  };
  await fs.writeFile(
    path.join(imageDir, 'index.json'),
    JSON.stringify(index, null, 2),
  );

  console.log('OCI image generated successfully.');
}

function sha256(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

async function createTarLayer(files: { [fileName: string]: string }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pack = tar.pack();
    const chunks: Buffer[] = [];

    for (const [fileName, content] of Object.entries(files)) {
      pack.entry({ name: fileName }, content);
    }

    pack.finalize();

    pack.on('data', (chunk) => chunks.push(chunk));
    pack.on('end', () => resolve(Buffer.concat(chunks)));
    pack.on('error', (err) => reject(err));
  });
}

main().catch((error) => {
  console.error('Error generating OCI image:', error);
  process.exit(1);
});
