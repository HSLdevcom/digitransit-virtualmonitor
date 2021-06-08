import { deflate, inflate } from 'zlib';

const createUrlCompression = <T extends object>(
  dictionary: Buffer = new Buffer(''),
) => ({
  unpack(packed: string): Promise<T> {
    if (!packed) {
      throw TypeError('Invalid 1st argument for genericUnpack');
    }
    return new Promise((resolve, reject) =>
      inflate(
        Buffer.from(packed, 'base64'),
        { dictionary },
        (err: Error | null, buffer: Buffer) => {
          if (err) {
            return reject(Error);
          }
          return resolve(JSON.parse(buffer.toString()));
        },
      ),
    );
  },
  pack(objectToPack: T): Promise<string> {
    return new Promise((resolve, reject) =>
      deflate(
        JSON.stringify(objectToPack),
        { dictionary },
        (err: Error | null, buffer: Buffer) => {
          if (err) {
            reject(Error);
          }
          resolve(buffer.toString('base64'));
        },
      ),
    );
  },
});

export default createUrlCompression;
