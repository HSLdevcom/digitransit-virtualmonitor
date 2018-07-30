import * as React from 'react';
import { create } from 'react-test-renderer';

import HslLogo from './HslLogo';

it('renders without crashing', () => {
  const renderer = create(<HslLogo />);
  renderer.unmount();
});
