import { deflate, inflate } from 'zlib';

// eslint-disable-next-line @typescript-eslint/ban-types
const createUrlCompression = (
  dictionary = new Buffer.from(''),
) => ({
  unpack(packed) {
    if (!packed) {
      return reject('no string provided');
    }
    return new Promise((resolve, reject) =>
      inflate(
        Buffer.from(packed, 'base64'),
        { dictionary },
        (err, buffer) => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.parse(buffer.toString()));
        },
      ),
    );
  },
  pack(objectToPack) {
    return new Promise((resolve, reject) =>
      deflate(
        JSON.stringify(objectToPack),
        { dictionary },
        (err, buffer) => {
          if (err) {
            reject();
          }
          resolve(buffer.toString('base64'));
        },
      ),
    );
  },
});

export default createUrlCompression;