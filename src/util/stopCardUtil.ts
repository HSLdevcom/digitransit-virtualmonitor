export const defaultStopCard = () => ({
  id: 1,
  title: { fi: '', sv: '', en: '' },
  columns: {
    left: {
      inUse: true,
      title: { fi: '', sv: '', en: '' },
      stops: [],
    },
    right: {
      inUse: false,
      title: { fi: '', sv: '', en: '' },
      stops: [],
    },
  },
  layout: 2,
  duration: 5,
});

export const getStopIcon = stop => {
  const stopWithStationIcons = [
    'airplane',
    'ferry',
    'subway',
    'hybrid-bus-tram',
  ];
  if (
    stop.locationType === 'STATION' ||
    stopWithStationIcons.includes(stop.mode?.toLowerCase())
  ) {
    const mode = stop.mode;
    return `station-${mode?.toLowerCase()}`;
  }
  return `stop-${stop.vehicleMode?.toLowerCase()}`;
};

export const getRouteMode = route => {
  switch (route.type) {
    case 702:
      return 'bus-express';
    case 704:
      return 'bus-local';
    default:
      return route.mode?.toLowerCase();
  }
};

export const getModeFromAddendum = modes => {
  let mode;
  if (modes) {
    if (modes.includes('BUS-EXPRESS')) {
      return 'BUS-EXPRESS';
    }
    if (modes.includes('BUS-LOCAL')) {
      return 'BUS';
    }
    mode =
      modes.length === 1 ? modes[0] : 'hybrid-'.concat(modes.sort().join('-'));
    return mode;
  }
  return 'N/A';
};
