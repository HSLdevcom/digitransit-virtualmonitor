/*import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils'
import { StaticRouter } from 'react-router';
import { create } from 'react-test-renderer';

import App from 'src/App';
import StopSelector from 'src/ui/StopSelector';
import StopTimesView from 'src/ui/Views/StopTimesView';

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

it('renders a StopTimesView when there\'s "/stop/623" in url', () => {
  const renderer = create(<WrappedApp location={'/stop/623'} />);

  expect(renderer.root.findByType(StopTimesView));
  renderer.unmount();
});

it('Passes correct stop to StopTimesRetriver', () => {
  const renderer = create(<WrappedApp location={'/stop/HSL:4160216/11'} />);
  const stopTimesView = renderer.root.findByType(StopTimesView);
  expect(stopTimesView);
  expect(stopTimesView.props).toMatchObject({
    displayedRoutes: 11,
    stopIds: ['HSL:4160216'],
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
*/