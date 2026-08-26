import React from 'react';
import { render } from '@testing-library/react';
import PreviewModal from './PreviewModal';
import userEvent from '@testing-library/user-event';

vi.mock('react-i18next', () => ({
  useTranslation: () => [k => k],
}));

vi.mock('./Icon', () => ({ default: () => null }));
vi.mock('./CarouselDataContainer', () => ({
  default: () => React.createElement('div', null, 'CarouselDataContainer'),
}));
vi.mock('./InformationDisplayContainer', () => ({
  default: () =>
    React.createElement('div', null, 'InformationDisplayContainer'),
}));
vi.mock('./TrainDataPreparer', () => ({
  default: () => React.createElement('div', null, 'TrainDataPreparer'),
}));
vi.mock('../util/monitorUtils', () => ({
  isPlatformOrTrackVisible: jest.fn(() => true),
}));

const defaultProps = {
  view: {
    cards: [
      {
        columns: null,
        layout: 2,
        title: {
          fi: 'Testi',
          en: 'Test',
          sv: 'Test',
        },
        duration: 10,
      },
    ],
    languages: ['fi', 'en'],
  },
  isOpen: true,
  onClose: jest.fn(),
  isLandscape: true,
  stations: [],
  stops: [],
  mapSettings: {},
  languages: ['fi', 'en'],
  ariaHideApp: false,
};

describe('PreviewModal', () => {
  it('renders Modal when open', () => {
    const screen = render(<PreviewModal {...defaultProps} />);
    expect(screen.getByText('preview')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const screen = render(<PreviewModal {...defaultProps} />);
    await userEvent.click(screen.getByLabelText('close'));
    expect(defaultProps.onClose).toHaveBeenCalled();
    expect(screen.getByText('CarouselDataContainer')).toBeInTheDocument();
  });

  it('renders CarouselDataContainer if no stations/stops and not info display', () => {
    const { getByText } = render(<PreviewModal {...defaultProps} />);
    expect(getByText('CarouselDataContainer')).toBeInTheDocument();
  });

  it('applies portrait class when isLandscape is false', () => {
    const props = { ...defaultProps, isLandscape: false };
    render(<PreviewModal {...props} />);
    const portal = document.querySelector('.portrait');
    expect(portal?.className).toMatch(/portrait/);
  });
});
