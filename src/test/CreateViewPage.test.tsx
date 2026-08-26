vi.mock('@digitransit-component/digitransit-component-autosuggest', () => ({
  __esModule: true,
  default: () => <div>DTAutosuggest</div>,
}));

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConfigContext } from '../contexts';
import CreateViewPage from '../ui/CreateViewPage';
import { MockedProvider } from '@apollo/client/testing';

const mockConfig = {
  login: {
    inUse: false,
    frontPageContent: [],
  },
  map: {
    inUse: false,
  },
  modeIcons: {
    colors: {
      'mode-airplane': '#ff0000',
      'mode-bus': '#00ff00',
      'mode-tram': '#0000ff',
      'mode-subway': '#ffff00',
      'mode-rail': '#ff00ff',
      'mode-ferry': '#00ffff',
      'mode-citybike': '#ff8800',
      'mode-citybike-secondary': '#0088ff',
    },
    postfix: 'icon',
    setName: 'default',
  },
  alertOrientation: 'horizontal',
  colors: {
    alert: '#ff0000',
    monitorBackground: '#ffffff',
    primary: '#0000ff',
  },
};

const mocks = [];
const withContext = () => {
  return (
    <MockedProvider mocks={mocks}>
      <ConfigContext.Provider value={mockConfig}>
        <CreateViewPage />
      </ConfigContext.Provider>
    </MockedProvider>
  );
};

it('renders the page.', () => {
  const screen = render(<MemoryRouter>{withContext()}</MemoryRouter>);
  expect(screen.getByText('stoptitle - FI')).toBeInTheDocument();
  expect(screen.getByText('prepareDisplay')).toBeInTheDocument();
  expect(screen.getByText('previewView')).toBeInTheDocument();
  expect(screen.getByText('displayEditorStaticLink')).toBeInTheDocument();
  expect(screen.getByText('arrow-down.svg')).toBeInTheDocument();
  expect(screen.queryByRole('textbox')).toBeInTheDocument();
  expect(screen.getByText('DTAutosuggest')).toBeInTheDocument();
  expect(screen.getByText('displayLanguages')).toBeInTheDocument();
});

it('gives the default layout option first.', () => {
  const screen = render(<MemoryRouter>{withContext()}</MemoryRouter>);
  expect(screen.getByText('layout2.svg')).toBeInTheDocument();
});
