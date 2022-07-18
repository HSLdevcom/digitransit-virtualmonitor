import React from 'react';
import { render } from '@testing-library/react';
import { Router, MemoryRouter, Link } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import IndexPage from '../ui/IndexPage';
import userEvent from '@testing-library/user-event';
import { ConfigContext } from '../contexts';

const mockConfig = {
  allowLogin: false,
  frontPageContent: [],
};

const withContext = () => {
  return (
    <ConfigContext.Provider value={mockConfig}>
      <IndexPage
        buttons={
          <Link
            to={'/createview'}
            id="create-new-link"
            aria-label={'quickDisplayCreate'}
          >
            <button className="monitor-button blue">
              {'quickDisplayCreate'}
            </button>
          </Link>
        }
      />
    </ConfigContext.Provider>
  );
};

it('should add createView to path when the button is clicked', () => {
  const history = createMemoryHistory();

  // mock push function
  history.push = jest.fn();

  const screen = render(<Router history={history}>{withContext()}</Router>);
  userEvent.click(screen.getByText('quickDisplayCreate'));
  expect(history.push).toHaveBeenCalledWith('/createview');
});

it('render an image', () => {
  const screen = render(<MemoryRouter>{withContext()}</MemoryRouter>);
  expect(screen.getAllByAltText('monitor-image').length).toEqual(1);
});
