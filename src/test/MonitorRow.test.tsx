import React from 'react';
import { render } from '@testing-library/react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MonitorRow from '../ui/MonitorRow';
import { departure, stop } from './data/monitor';

const defaultProps = {
  alertState: 0,
  currentLang: "fi",
  dayForDivider: undefined,  
  departure: departure,
  isFirst: true,
  isTwoRow: false,
  showMinutes: 15,
  showVia: true,
  stops: [stop],
  translations: [],
  withTwoColumns: false,
  withoutRouteColumn: false,
}

it('should render a row correctly', () => {
  
  const {container} = render(
      <MonitorRow {...defaultProps}/>
  );

  expect(container.getElementsByClassName('destination-row')[0].innerHTML).toEqual('Jyväskylä');
  // TODO.: add tests for other fields

});

it('should render a cancelled departure', () => {
  
  const dep = {
    ...departure,
    realtimeState: 'CANCELED',
  }

  const props = {
    ...defaultProps,
    departure: dep,
    alertState: 1,
  }

  const {container} = render(
     <MonitorRow {...props} />
  );
  expect(container.getElementsByClassName('cancelled-row')[0].innerHTML).toEqual('cancelled');

});

it('should render a cancelled departure with alert icon and destination', () => {
  
  const dep = {
    ...departure,
    realtimeState: 'CANCELED',
  }

  const props = {
    ...defaultProps,
    departure: dep,
    alertState: 0,
  }

  const {container} = render(
     <MonitorRow {...props} />
  );
  //console.log(container.getElementsByClassName('grid-col destination')[0].firstChild)
  expect(container.getElementsByClassName('destination-row')[0].innerHTML).toEqual('Jyväskylä');
  //expect(container.getElementsByClassName('grid-col destination')[0].firstChild.toEqual('svg');

});


