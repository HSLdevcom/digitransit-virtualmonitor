import React from 'react';
import MapModal from './MapModal';
import { ConfigContext } from '../contexts';
import { BoundingBox } from '../util/Interfaces';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('react-i18next', () => ({
  useTranslation: () => [jest.fn(key => key)],
}));
jest.mock('./Icon', () => () => <div>Icon</div>);
jest.mock('../MonitorMapContainer', () => () => <div>MonitorMapContainer</div>);
jest.mock(
  'classnames',
  () =>
    (...args: any[]) =>
      args.join(' '),
);

const bounds: BoundingBox = [
  [0, 0],
  [1, 1],
];
const center: [number, number] = [0.5, 0.5];
describe('MapModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    isLandscape: true,
    mapSettings: {
      zoom: 10,
      center: center,
      bounds: bounds,
    },
    updateMapSettings: jest.fn(),
    lang: 'en',
    zoom: 12,
    center: [0, 0],
    ariaHideApp: false,

    setMapSettings: jest.fn(),
    setZoom: jest.fn(),
    setCenter: jest.fn(),
    setBounds: jest.fn(),
    setUserSet: jest.fn(),
    setMapLanguage: jest.fn(),
  };
  const mockConfig = {
    map: {
      inUse: true,
      mapLanguage: 'en',
    },
    login: {
      inUse: false,
      frontPageContent: [],
    },
    colors: {
      primary: '#0000ff',
      monitorBackground: '#ffffff',
      alert: '#ff0000',
    },
  };

  const mocks = [];
  const withContext = (updateMapSettings = null, onClose = null) => {
    return (
      <ConfigContext.Provider value={mockConfig}>
        <MapModal
          {...defaultProps}
          updateMapSettings={updateMapSettings}
          onClose={onClose}
        />
      </ConfigContext.Provider>
    );
  };

  it('renders without crashing', () => {
    const screen = render(<MemoryRouter>{withContext()}</MemoryRouter>);
    expect(screen.getByText('select-bounds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    const screen = render(
      <MemoryRouter>{withContext(() => null, onClose)}</MemoryRouter>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it('calls updateMapSettings and onClose when confirm button is clicked', async () => {
    const updateMapSettings = jest.fn();
    const onClose = jest.fn();
    const screen = render(
      <MemoryRouter>{withContext(updateMapSettings, onClose)}</MemoryRouter>,
    );
    await userEvent.click(screen.getByText('confirm-choice'));
    // wrapper.find('.btn.map-btn').simulate('click');
    expect(updateMapSettings).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledWith(false);
  });

  it('renders portrait class when isLandscape is false', () => {
    const screen = render(
      <MemoryRouter>
        <MockedProvider mocks={mocks}>
          <ConfigContext.Provider value={mockConfig}>
            <MapModal {...defaultProps} isLandscape={false} isOpen={true} />
          </ConfigContext.Provider>
        </MockedProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('select-bounds')).toBeInTheDocument();
    expect(
      document.body.querySelector('.preview.portrait'),
    ).toBeInTheDocument();
  });
});
