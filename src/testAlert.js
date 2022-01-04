const now = new Date();
const endTime = new Date().setMinutes(now.getMinutes() + 3);
export default {
  inUse: false,
  alerts: [
    {
      alertDescriptionTextTranslations: [
        {
          language: 'fi',
          text: 'If you see this in production, the developers have failed you big time..',
        },
      ],
      alertHeaderText: 'Header text for dummy alert',
      alertHeaderTextTranslations: [
        {
          language: 'fi',
          text: 'If you see this in production, the developers have failed you big time..',
        },
      ],
      alertSeverityLevel: 'SEVERE',
      effectiveStartDate: new Date().getTime() / 1000,
      effectiveEndDate: new Date(endTime).getTime() / 1000,
      stop: null,
    },
  ],
};
