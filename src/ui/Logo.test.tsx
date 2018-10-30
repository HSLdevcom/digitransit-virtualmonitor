import * as React from 'react';
import { create } from 'react-test-renderer';

import Logo from 'src/ui/Logo';

it('renders without crashing', () => {
  const renderer = create(<Logo />);
  renderer.unmount();
});
