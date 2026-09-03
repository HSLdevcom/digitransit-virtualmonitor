import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Link } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ConfigContext } from '../contexts';
import MonitorRowContainer from '../ui/MonitorRowContainer';

const mockConfig = {
  login: {
    inUse: false,
    frontPageContent: [],
  },
};

const mockProps = {
  viewId: 1,
  departuresLeft: [
    {
      stop: {
        gtfsId: 'HSL:2631202',
        code: 'E6302',
        platformCode: '2',
        parentStation: null,
      },
      realtime: true,
      pickupType: 'SCHEDULED',
      serviceDay: Math.floor(Date.now() / 1000),
      scheduledDeparture: 34860,
      realtimeDeparture: 34885,
      realtimeState: 'UPDATED',
      headsign: 'Myyrmäki',
      headsignfi: 'Myyrmäki',
      headsignsv: 'Myrbacka',
      headsignen: 'Myyrmäki',
      showStopNumber: false,
      showVia: false,
      vehicleMode: 'BUS',
      trip: {
        tripHeadsign: 'Myyrmäki',
        tripHeadsignfi: 'Myyrmäki',
        tripHeadsignsv: 'Myrbacka',
        tripHeadsignen: 'Myyrmäki',
        directionId: '0',
        gtfsId: 'HSL:5530_20250703_Pe_1_0913',
        route: {
          longNamefi: 'Matinkylä (M)-Finnoo (M)-Espoon keskus-Myyrmäki',
          longNamesv: 'Mattby (M)-Finno (M)-Esbo centrum-Myrbacka',
          longNameen: 'Matinkylä (M)-Finnoo (M)-Espoon keskus-Myyrmäki',
          longName: 'Matinkylä (M)-Finnoo (M)-Espoon keskus-Myyrmäki',
          shortName: '530',
          gtfsId: 'HSL:5530',
          alerts: [],
        },
      },
      combinedPattern: 'HSL:5530:530:Myyrmäki:0',
      renameID: 'Myyrmäki',
      stops: [
        {
          name: 'Matinkylä (M)',
          gtfsId: 'HSL:2314215',
          direction: null,
          code: '2145',
          platformCode: '1',
          parentStation: null,
        },
      ],
      route: {
        longName: 'Matinkylä (M)-Finnoo (M)-Espoon keskus-Myyrmäki',
        shortName: '530',
        gtfsId: 'HSL:5530',
        alerts: [],
      },
    },
  ],
  showStopNumber: false,
  showVia: false,
  departuresRight: [],
  rightStops: [],
  leftStops: [
    {
      name: 'Jorvi',
      gtfsId: 'HSL:2631202',
      locationType: 'STOP',
      parentStation: null,
      mode: 'BUS-EXPRESS',
      code: 'E6302',
      locality: 'Espoo',
      lat: 60.223356,
      lon: 24.689578,
    },
  ],
  layout: 2,
  isLandscape: true,
  alertState: 0,
  alertRowSpan: 2,
  showMinutes: 10,
  closedStopViews: [],
  preview: false,
  mapSettings: {
    hideTimeTable: false,
    showMapDisplay: true,
    mapLanguage: 'fi',
  },
};
const withContext = (lang: 'fi' | 'sv' | 'en') => {
  return (
    <ConfigContext.Provider value={mockConfig}>
      <MonitorRowContainer
        {...mockProps}
        alertComponent={undefined}
        alertRowSpan={0}
        closedStopViews={[]}
        preview={false}
        currentLang={lang}
      />
    </ConfigContext.Provider>
  );
};
it('should render the headers', () => {
  const screen = render(<MemoryRouter>{withContext('fi')}</MemoryRouter>);
  expect(screen.getByText('lineId')).toBeInTheDocument();
  expect(screen.getByText('destination')).toBeInTheDocument();
  expect(screen.getByText('departureTime')).toBeInTheDocument();
});

it('should render the Myyrmäki row  fi', () => {
  const screen = render(<MemoryRouter>{withContext('fi')}</MemoryRouter>);
  expect(screen.getByText('Myyrmäki')).toBeInTheDocument();
});

it('should render the Myyrmäki row sv', () => {
  const screen = render(<MemoryRouter>{withContext('sv')}</MemoryRouter>);
  expect(screen.getByText('Myrbacka')).toBeInTheDocument();
});

it('should render the Myyrmäki row  en', () => {
  const screen = render(<MemoryRouter>{withContext('en')}</MemoryRouter>);
  expect(screen.getByText('Myyrmäki')).toBeInTheDocument();
});
