import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Link, Route, Routes } from 'react-router-dom';
import IndexPage from '../ui/IndexPage';
import userEvent from '@testing-library/user-event';
import { ConfigContext } from '../contexts';

const mockConfig = {
  login: {
    inUse: false,
    frontPageContent: [],
  },
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

it('should add createView to path when the button is clicked', async () => {
  const screen = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={withContext()} />
        <Route path="/createview" element={<div>createview probe</div>} />
      </Routes>
    </MemoryRouter>,
  );
  await userEvent.click(screen.getByText('quickDisplayCreate'));
  expect(screen.getByText('createview probe')).toBeInTheDocument();
});

it('render an image', () => {
  const { container } = render(<MemoryRouter>{withContext()}</MemoryRouter>);
  const img = container.querySelector('svg.desktop-img');
  expect(img).not.toBeNull();
  expect(img.getAttribute('aria-hidden')).toBe('true');
});
