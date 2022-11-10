import { IDeparture, IStop } from '../../ui/MonitorRow';

export const stop: IStop = {
  gtfsId: 'HSL:123123',
  code: 'H1234',
  platformCode: '3',
  parentStation: null,
};

export const departure: IDeparture = {
  showStopNumber: false,
  showVia: false,
  vehicleMode: '',
  combinedPattern: 'MATKA:60061713:87:Jyväskylä:',
  headsign: 'JYVÄSKYLÄ',
  pickupType: 'SCHEDULED',
  realtime: true,
  route: { alerts: [], shortName: '123' },
  realtimeDeparture: 51763,
  realtimeState: 'UPDATED',
  serviceDay: 1645480800,
  stop: stop,
  trip: {
    tripHeadsign: 'Helsinki',
    gtfsId: 'HSL:1234trip',
    stops: [stop],
    route: { alerts: [], shortName: '123' },
  },
};
