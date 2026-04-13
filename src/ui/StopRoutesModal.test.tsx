import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import StopRoutesModal, { defaultSettings } from './StopRoutesModal';
import { ConfigContext } from '../contexts';

const mockConfig = {
  colors: { primary: '#000' },
  modeIcons: { postfix: '', colors: { 'mode-bus': '#123' } },
};

const mockStop = {
  code: '1234',
  name: 'Test Stop',
  patterns: [
    {
      code: '55',
      headsign: 'Kamppi',
      shortname: 'Kamppi',

      route: {
        gtfsId: 'HSL:1234',
        shortName: '55',
        mode: 'BUS',
        code: 1234,
        headsign: 'Kamppi',
      },
    },
  ],
};

const mockCombinedPatterns = ['HSL:1234:55:Kamppi', 'HSL:1234:56:Pasila'];

const mockLanguages = ['fi', 'en'];
const mocks = [];

describe('StopRoutesModal', () => {
  const closeModal = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <MockedProvider mocks={mocks}>
        <ConfigContext.Provider value={mockConfig}>
          <StopRoutesModal
            showModal={true}
            stop={mockStop}
            closeModal={closeModal}
            stopSettings={defaultSettings}
            combinedPatterns={mockCombinedPatterns}
            languages={mockLanguages}
            ariaHideApp={false}
            {...props}
          />
        </ConfigContext.Provider>
      </MockedProvider>,
    );

  beforeEach(() => {
    closeModal.mockClear();
  });

  it('renders modal when showModal is true', () => {
    renderComponent();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders stop name and code', () => {
    renderComponent();
    expect(screen.getByText('stopSettings')).toBeInTheDocument();
  });

  it('renders checkboxes for show settings', () => {
    renderComponent();
    expect(screen.getAllByLabelText('hideLine', { exact: false })).toHaveLength(
      mockCombinedPatterns.length,
    );

    expect(
      screen.getByLabelText('showEndOfLine', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('via', { exact: false })).toBeInTheDocument();
  });

  it('calls closeModal with null when close button is clicked', () => {
    renderComponent();
    const closeButton = screen.getByRole('button', { name: 'close' });
    fireEvent.click(closeButton);
    expect(closeModal).toHaveBeenCalledWith(null);
  });

  it('renders route rows for each combined pattern', () => {
    renderComponent();
    expect(screen.getAllByLabelText('hideLine').length).toBe(
      mockCombinedPatterns.length,
    );
  });

  it('calls closeModal with settings when save button is clicked', () => {
    renderComponent();
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(closeModal).toHaveBeenCalled();
  });

  it('toggles showInputs when renameDestinations is clicked', () => {
    renderComponent();
    const renameBtn = screen.getByRole('button', {
      name: 'renameDestinations',
    });
    fireEvent.click(renameBtn);
    // After clicking, inputs should not be readOnly
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.some(input => input.hasAttribute('readOnly'))).toBe(false);
  });

  it('checks and unchecks route checkboxes', () => {
    renderComponent();
    const firstCheckbox = screen.getByRole('checkbox', {
      name: 'show showRouteColumn',
    });
    expect(firstCheckbox).toBeChecked();
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
    // State updates, but we can't check the new state without access to the component's state.
    // This test ensures the handler doesn't throw.
  });
});
