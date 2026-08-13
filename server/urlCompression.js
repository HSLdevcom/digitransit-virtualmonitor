import { deflate, inflate } from 'zlib';

const createUrlCompression = (dictionary = Buffer.from('')) => ({
  unpack(packed) {
    if (!packed) {
      return Promise.reject(new Error('no string provided'));
    }
    return new Promise((resolve, reject) => {
      inflate(Buffer.from(packed, 'base64'), { dictionary }, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(buffer.toString()));
      });
    });
  },
  pack(objectToPack) {
    return new Promise((resolve, reject) => {
      deflate(JSON.stringify(objectToPack), { dictionary }, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(buffer.toString('base64'));
      });
    });
  },
});

export default createUrlCompression;
