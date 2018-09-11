import * as React from 'react';
import { create } from 'react-test-renderer';

import Titlebar from 'src/ui/Titlebar';

it('renders without crashing', () => {
  const renderer = create(
    <Titlebar>
      <div>Dummy div</div>
    </Titlebar>
  );
  renderer.unmount();
});
