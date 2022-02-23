import React from 'react';
import { screen, render } from '@testing-library/react';

import Titlebar from '../ui/Titlebar';

it('renders children without crashing', () => {
  render(
    <Titlebar>
      <div id="title-test">Dummy div</div>
    </Titlebar>,
  );

  const child = screen.getByText(/Dummy div/i);
  expect(child).toBeInTheDocument();
});
