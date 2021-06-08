import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';

import StopName, { IStopInfoProps, STOP_INFO_QUERY } from './StopName';

const delay = (milliSeconds = 0) =>
  new Promise(resolve => setTimeout(resolve, milliSeconds));

const mocks = [
  {
    request: {
      query: STOP_INFO_QUERY,
      variables: {
        stopId: '123',
      },
    },
    result: {
      data: {
        stop: {
          name: 'TestStop',
        },
      },
    },
  },
];

const WrappedStopName = (props: IStopInfoProps) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <StopName {...props} />
  </MockedProvider>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedStopName stopIds={[]} />);
  renderer.unmount();
});

it('Displays stop number while loading from API', () => {
  const renderer = create(<WrappedStopName stopIds={['123']} />);

  const divs = renderer.root.findAllByType('div');
  expect(divs[0].children).toContain('stop - {"stop":"123"}');
  renderer.unmount();
});

it('Displays stop name retrieved from API', async () => {
  const renderer = create(<WrappedStopName stopIds={['123']} />);

  const divs = renderer.root.findAllByType('div');
  await delay();
  expect(divs[0].children).toContain('TestStop');
  renderer.unmount();
});
