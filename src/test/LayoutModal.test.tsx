import React from 'react';
import { render, screen } from '@testing-library/react';
import LayoutModal from '../ui/LayoutModal';
import { ConfigContext } from '../contexts';

const defaultProps = {
  option: { rows: '16', value: '14', label: undefined },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSave: () => {},
  open: true,
  orientation: 'horizontal',
  ariaHideApp: false,
  allowInformationDisplay: true,
};

const mockConfig = {
  colors: {
    primary: '#000000',
  },
};

const withContext = () => (
  <ConfigContext.Provider value={mockConfig}>
    <LayoutModal {...defaultProps} />
  </ConfigContext.Provider>
);

it('should render', () => {
  render(withContext());
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('renders content when modal is open', () => {
  render(withContext());
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  // Modal renders horizontal layout sections and a save button
  expect(screen.getByText('one-column')).toBeInTheDocument();
  expect(screen.getByText('two-columns')).toBeInTheDocument();
  expect(screen.getByText('save')).toBeInTheDocument();
});
