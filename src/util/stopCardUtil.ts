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
