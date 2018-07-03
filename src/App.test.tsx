import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { StaticRouter } from 'react-router';

import App from './App';

const WrappedApp = () => (
  <StaticRouter>
    <App />
  </StaticRouter>
);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WrappedApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
