import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StaticRouter } from 'react-router';
import { create } from 'react-test-renderer';

import App from 'src/App';
import StopIncomingRetriever from './ui/StopIncomingRetriever';

const WrappedApp = ({ location = '' }: { location?: string} ) => (
  <StaticRouter location={location}>
    <App />
  </StaticRouter>
);

it('renders without crashing', () => {
  const renderer = create(<WrappedApp />);
  renderer.unmount();
});

it('renders a StopIncomingRetriever when there\'s "/stop/623" in url', () => {
  const renderer = create(<WrappedApp location={'/stop/623'} />);

  expect(renderer.root.findByType(StopIncomingRetriever));
  // console.log (renderer.root.findAllByType(StopIncomingRetriever, { deep: true }));
  // expect(renderer.root.findAllByType(StopIncomingRetriever, { deep: true }));
});
