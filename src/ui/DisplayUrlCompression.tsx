import * as React from 'react';
import Async, { Props as AsyncProps } from 'react-promise';

import { IDisplay } from 'src/ui/ConfigurationList';
import ViewCarousel from 'src/ui/ViewCarousel';
import createUrlCompression from 'src/urlCompression';

interface IDisplayUrlCompressionProps {
  readonly version: string,
  readonly packedString: string,
};

const AsyncInflater = <T extends {}>({ children, promise }: { children: (unpacked: T) => React.ReactNode, promise: AsyncProps<T>['promise'] }) => (
  <Async
    promise={promise}
    then={(unpacked) => (
      unpacked
        ? children(unpacked)
        : (<div>Error while unpacking</div>)
    )}
    pending={() => (<div>Still unpacking...</div>)}
  />
);

// The strings are dictionaries to optimise the compression. The compression and decompression can use this string as a reference instead of
// writing "displaySeconds", manually. This is especially effective for shorter data.
// DO NOT MODIFY existing dictionaries as this would break all existing urls.
const displayDictionaries = {
  'v0': '{"displaySeconds":,"view":{"pierColumnTitle":","stops":[","},"title":{"fi","en"}}]}},"type":"stopTimes"HSL:10"]}',
};

const renderers = {
  'v0': (display: IDisplay) => (
    <ViewCarousel
      viewCarousel={display.viewCarousel}
    />
  ),
};

Object.entries({ a: 'b'}).reduce((acc, [version, renderer]) => ({
  ...acc,
  version: renderer
}),
{})

export const pairs = Object.entries(renderers).reduce(
  (acc, [version, renderer]) => ({
    ...acc,
    [version]: {
      renderer,
      ...createUrlCompression(Buffer.from(displayDictionaries[version])),
    },
  }),
  {}
);

const DisplayUrlCompression = ({version, packedString}: IDisplayUrlCompressionProps) => (
  <AsyncInflater
    promise={pairs[version].unpack(packedString)}
  >
    {pairs[version].renderer}
  </AsyncInflater>
);

// const displayUrlCompress = (version, ) => pairs[version].pack()

export default DisplayUrlCompression;
