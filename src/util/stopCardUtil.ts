export const defaultStopCard = t => ({
  id: 1,
  title: t('viewEditorName'),
  columns: {
    left: {
      inUse: true,
      title: t('sideLeft'),
      stops: [],
    },
    right: {
      inUse: false,
      title: t('sideRight'),
      stops: [],
    },
  },
  layout: 2,
  duration: 5,
});
