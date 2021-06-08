import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { create } from 'react-test-renderer';

import AutoMoment from './AutoMoment';
// import StopTimesRetriever from 'src/ui/StopTimesRetriever';
// import StopName from 'src/ui/StopName';
import VirtualMonitor, { IVirtualMonitorProps } from './VirtualMonitor';

const WrappedVirtualMonitor = (props: IVirtualMonitorProps) => (
  <MockedProvider>
    <VirtualMonitor {...props} />
  </MockedProvider>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedVirtualMonitor />);
  renderer.unmount();
});

/* it('renders a title and no <StopName /> if provided with a title', () => {
  const renderer = create(<WrappedVirtualMonitor />);

  const divs = renderer.root.findAllByType('div');
  expect(divs.some(div => div.children.includes('Pysäkki undefined')));
  renderer.unmount();
});

it('renders a a <StopName /> if no title provided', () => {
  const renderer = create(<WrappedVirtualMonitor />);

  expect(renderer.root.findByType(StopName));
  renderer.unmount();
});
 */
it('displays current time', () => {
  const renderer = create(<WrappedVirtualMonitor />);
  // eslint-disable-next-line jest/valid-expect
  expect(renderer.root.findByType(AutoMoment));
  renderer.unmount();
});

/* it('renders a <StopTimesRetriever />', () => {
  const renderer = create(<WrappedVirtualMonitor />);
  expect(renderer.root.findByType(StopTimesRetriever));
  renderer.unmount();
});
 */
