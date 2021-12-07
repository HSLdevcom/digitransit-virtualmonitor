import * as React from 'react';
import Async, { Props as AsyncProps } from 'react-promise';
import createUrlCompression from '../urlCompression';
import OldMonitorParser from './OldMonitorParser';
import Loading from './Loading';

export interface ILatLon {
  readonly lat: number;
  readonly lon: number;
}
interface INode {
  readonly id?: string;
  readonly __typename?: string;
}

interface ITranslatedString {
  readonly [twoLetterLanguageCode: string]: string;
}

export interface IStop extends INode {
  readonly gtfsId: string;
  readonly overrideStopName?: string;
}

export interface IViewBase extends INode {
  readonly title?: ITranslatedString;
  readonly type: string;
}

export interface IStopTimesView extends IViewBase {
  readonly displayedRoutes?: number;
  readonly pierColumnTitle?: string;
  readonly stops: ReadonlyArray<IStop>;
}

type AnyView = IStopTimesView;

export interface IViewCarouselElement extends INode {
  readonly view: AnyView;
  readonly displaySeconds: number;
}

export type IViewCarousel = ReadonlyArray<IViewCarouselElement>;

export interface IDisplay extends INode {
  readonly position?: ILatLon;
  readonly name: string;
  readonly viewCarousel: IViewCarousel;
}

export interface IConfiguration extends INode {
  readonly name?: string;
  readonly displays: ReadonlyArray<IDisplay>;
  readonly position?: ILatLon;
}

export type IConfigurations = ReadonlyArray<IConfiguration>;
interface IDisplayUrlCompressionProps {
  readonly version: string;
  readonly packedString: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const AsyncInflater = <T extends {}>({
  children,
  promise,
}: {
  children: (unpacked: T) => React.ReactNode;
  promise: AsyncProps<T>['promise'];
}) => (
  <Async
    promise={promise}
    then={unpacked =>
      unpacked ? children(unpacked) : <div>Error while unpacking</div>
    }
    pending={() => <Loading />}
  />
);

// The strings are dictionaries to optimise the compression. The compression and decompression can use this string as a reference instead of
// writing "displaySeconds", manually. This is especially effective for shorter data.
// DO NOT MODIFY existing dictionaries as this would break all existing urls.
const displayDictionaries = {
  v0: '{"displaySeconds":,"view":{"pierColumnTitle":","stops":[","},"title":{"fi","en"}}]}},"type":"stopTimes"HSL:10"]}',
};

const renderers = {
  v0: (display: IDisplay) => <OldMonitorParser display={display} />,
};

type IPair = ReturnType<typeof createUrlCompression>;

type IPairWithRenderer = IPair & {
  renderer: (display: IDisplay) => React.ReactNode;
};

interface IPairsWithRenderers {
  [version: string]: IPairWithRenderer;
}

export const pairs: IPairsWithRenderers = Object.entries(renderers).reduce(
  (acc, [version, renderer]) => ({
    ...acc,
    [version]: {
      renderer,
      ...createUrlCompression(Buffer.from(displayDictionaries[version])),
    },
  }),
  {},
);

const DisplayUrlCompression = ({
  version,
  packedString,
}: IDisplayUrlCompressionProps) => (
  <AsyncInflater promise={pairs[version].unpack(packedString)}>
    {pairs[version].renderer}
  </AsyncInflater>
);

// const displayUrlCompress = (version, ) => pairs[version].pack()

export default DisplayUrlCompression;
