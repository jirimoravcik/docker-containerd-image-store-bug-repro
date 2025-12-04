import Dockerode from 'dockerode';
import tar from 'tar-fs';
import zlib from 'node:zlib';
import concat from 'concat-stream';

const IMAGE_NAME = 'localhost:5678/my-repo:docker-containerd-image-store-bug-repro';

function createTar() {
  const pack = tar.pack();

  pack.entry({ name: 'Dockerfile' }, 'FROM ubuntu/squid');

  pack.finalize();

  return pack; // this is a tar stream!
}

const dockerode = new Dockerode({ Promise });

function modemDialPromised(modem, options) {
  return new Promise((resolve, reject) => {
    modem.dial(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

const pack = createTar();

const buffer = await new Promise((resolve, reject) => {
    pack.on('error', reject);
    pack.pipe(zlib.createGzip())
        .pipe(concat(resolve));
});

const opts = {
    method: 'POST',
    path: '/build?',
    file: buffer, // this is a Buffer with build context tar.gz file
    options: {
        t: IMAGE_NAME,
        forcerm: true,
        nocache: true,
        pull: true,
    },
    isStream: true,
    statusCodes: {
        200: true,
        404: 'not found',
        500: 'server error',
    },
};

const stream = await modemDialPromised(dockerode.modem, opts);

await new Promise((resolve, reject) => {
  stream.on('data', (data) => {
    console.log(data.toString());
  });

  stream.on('end', resolve);
  stream.on('error', reject);
});

// Push
const image = dockerode.getImage(IMAGE_NAME);
const optsPush = {
    stream: true,
};
const dockerPushStream = await image.push(optsPush);

await new Promise((resolve, reject) => {
    dockerPushStream.on('data', (data) => {
        console.log(`Push: ${data.toString().trim()}`);
    });

    dockerPushStream.on('end', resolve);
    dockerPushStream.on('error', reject);
});

console.log('done');
