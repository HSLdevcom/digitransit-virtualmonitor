import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { create } from 'react-test-renderer';

import AutoMoment from 'src/ui/AutoMoment';
import StopIncomingRetriever from 'src/ui/StopIncomingRetriever';
import StopName from 'src/ui/StopName';
import VirtualMonitor, { IVirtualMonitorProps } from 'src/ui/VirtualMonitor';

const WrappedVirtualMonitor = (props: IVirtualMonitorProps) => (
  <MockedProvider>
    <VirtualMonitor {...props} />
  </MockedProvider>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedVirtualMonitor stops={[]} />);
  renderer.unmount();
});

it('renders a title and no <StopName /> if provided with a title', () => {
  const renderer = create(<WrappedVirtualMonitor stops={[]} />);

  const divs = renderer.root.findAllByType('div');
  expect(divs.some(div => div.children.includes('Pysäkki undefined')));
  renderer.unmount();
});

it('renders a a <StopName /> if no title provided', () => {
  const renderer = create(<WrappedVirtualMonitor stops={[]} />);

  expect(renderer.root.findByType(StopName));
  renderer.unmount();
});

it('displays current time', () => {
  const renderer = create(<WrappedVirtualMonitor stops={[]} />);
  expect(renderer.root.findByType(AutoMoment));
  renderer.unmount();
});

it('renders a <StopIncomingRetriever />', () => {
  const renderer = create(<WrappedVirtualMonitor stops={[]} />);
  expect(renderer.root.findByType(StopIncomingRetriever));
  renderer.unmount();
});
