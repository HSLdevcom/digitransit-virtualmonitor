import React from 'react';
import { render } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MonitorRow from '../ui/MonitorRow';
import { departure, stop } from './data/monitor';
import { ConfigContext } from '../contexts';

const defaultProps = {
  alertState: 0,
  currentLang: 'fi',
  dayForDivider: undefined,
  departure: departure,
  isFirst: true,
  isTwoRow: false,
  showMinutes: 15,
  showVia: true,
  stops: [stop],
  withTwoColumns: false,
  withoutRouteColumn: false,
};

const mockConfig = {
  useTilde: true,
};

const withContext = prps => {
  return (
    <ConfigContext.Provider value={mockConfig}>
      <MonitorRow {...prps} />
    </ConfigContext.Provider>
  );
};

it('should render a row correctly', () => {
  const { container } = render(withContext(defaultProps));
  // destination
  expect(
    container.getElementsByClassName('destination-row')[0].innerHTML,
  ).toEqual('Jyväskylä');
  // shortName
  expect(
    container.getElementsByClassName('grid-col line')[0].innerHTML,
  ).toEqual('123');
  // time,
  expect(
    container.getElementsByClassName('grid-col time')[0].innerHTML.length,
  ).toBeGreaterThan(0);
});

it('should render a cancelled departure with the text cancelled', () => {
  const dep = {
    ...departure,
    realtimeState: 'CANCELED',
  };

  const props = {
    ...defaultProps,
    departure: dep,
    alertState: 1,
  };

  const { container } = render(withContext(props));
  expect(
    container.getElementsByClassName('cancelled-row')[0].innerHTML,
  ).toEqual('cancelled');
});

it('should render a cancelled departure with alert icon and destination', () => {
  const dep = {
    ...departure,
    realtimeState: 'CANCELED',
  };

  const props = {
    ...defaultProps,
    departure: dep,
  };

  const { container } = render(withContext(props));

  expect(
    container.getElementsByClassName('destination-row')[0].innerHTML,
  ).toEqual('Jyväskylä');
  expect(
    container.getElementsByClassName('grid-col destination')[0].children[0]
      .nodeName,
  ).toEqual('svg');
});

it('should do show tilde when realtime is off', () => {
  const dep = {
    ...departure,
    realtime: false,
  };

  const props = {
    ...defaultProps,
    departure: dep,
  };

  const { container } = render(withContext(props));
  expect(
    container.getElementsByClassName('grid-col time')[0].innerHTML,
  ).toContain('~');
});

it('should show the stop code when a departure does not have a platform code', () => {
  const dep = {
    ...departure,
    realtime: false,
  };

  const props = {
    ...defaultProps,
    departure: dep,
  };

  const { container } = render(withContext(props));

  expect(
    container.getElementsByClassName('grid-col code')[0].innerHTML,
  ).toContain('H1234');
});
