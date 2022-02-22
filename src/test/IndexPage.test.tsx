import React from 'react';
import { render } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import IndexPage from '../ui/IndexPage';
import userEvent from '@testing-library/user-event'

it('should add createView to path when the button is clicked', () => {

  const history = createMemoryHistory();

  // mock push function
  history.push = jest.fn();
  
  const screen = render(
    <Router history={history}>
      <IndexPage />
    </Router>,
  );
  userEvent.click(screen.getByText('quickDisplayCreate'));
  expect(history.push).toHaveBeenCalledWith('/createView');

});

it('render an image', () => {
  
  const screen = render(
    <MemoryRouter>
    <IndexPage />
  </MemoryRouter>,
  );
  expect(screen.getAllByAltText('monitor-image').length).toEqual(1)

});
