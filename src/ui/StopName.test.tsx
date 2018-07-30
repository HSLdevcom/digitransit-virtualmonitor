import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { create } from 'react-test-renderer';

import StopName, { IStopInfoProps, STOP_INFO_QUERY } from './StopName';

const mocks = [
  {
    request: {
      query: STOP_INFO_QUERY,
      variables: {
        stopId: '',
      },
    },
    result: {
      name: 'TestStop',
    },
  },
];

const WrappedStopName = (props: IStopInfoProps) => (
  <MockedProvider mocks={mocks}>
    <StopName {...props} />
  </MockedProvider>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedStopName stopIds={[]} />);
  renderer.unmount();
});

it('Displays stop name retrieved from API', () => {
  const renderer = create(<WrappedStopName stopIds={[]} />);

  const divs = renderer.root.findAllByType('div');
  expect(divs[0].children).toContain('Pysäkki undefined');
  renderer.unmount();
});
