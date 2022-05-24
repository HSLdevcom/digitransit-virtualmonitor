export const defaultStopCard = t => ({
  id: 1,
  title: { fi: t('viewEditorName'), sv: '', en: '' },
  columns: {
    left: {
      inUse: true,
      title: { fi: t('sideLeft'), sv: '', en: '' },
      stops: [],
    },
    right: {
      inUse: false,
      title: { fi: t('sideRight'), sv: '', en: '' },
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
  return route.type === 702 ? 'bus-express' : route.mode?.toLowerCase();
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
