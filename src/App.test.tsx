import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { StaticRouter } from 'react-router';
import { create } from 'react-test-renderer';

import App from 'src/App';
import StopSelector from 'src/ui/StopSelector';
import VirtualMonitor from 'src/ui/VirtualMonitor';

const WrappedApp = ({ location = '' }: { location?: string} ) => (
  <StaticRouter location={location} context={{}}>
    <MockedProvider>
      <App />
    </MockedProvider>
  </StaticRouter>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedApp />);
  renderer.unmount();
});

it('renders a VirtualMonitor when there\'s "/stop/623" in url', () => {
  const renderer = create(<WrappedApp location={'/stop/623'} />);

  expect(renderer.root.findByType(VirtualMonitor));
  renderer.unmount();
});

it('Passes correct stop to StopIncomingRetriver', () => {
  const renderer = create(<WrappedApp location={'/stop/HSL:4160216/11'} />);
  const virtualMonitor = renderer.root.findByType(VirtualMonitor);
  expect(virtualMonitor);
  expect(virtualMonitor.props).toMatchObject({
    displayedRoutes: '11',
    stops: ['HSL:4160216'],
  });
  renderer.unmount();
});

it('renders a StopSelector with no stop defined', () => {
  const renderer = create(<WrappedApp location={''} />);

  expect(renderer.root.findByType(StopSelector));
  renderer.unmount();
});

it('passes search phase to StopSelector', () => {
  const renderer = create(<WrappedApp location={'/searchStop/Kaivo'} />);
  const stopSelector = renderer.root.findByType(StopSelector);
  expect(stopSelector);
  expect(stopSelector.props.match.params.phrase).toBe('Kaivo');
  renderer.unmount();
});
