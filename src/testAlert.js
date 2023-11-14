import { DateTime } from 'luxon';

export default {
  inUse: true,
};

export const getDummyAlerts = initTime => {
  const now = new Date(initTime);
  const duration = 1;

  const formattedStartTime = DateTime.fromJSDate(now).toFormat('HH:mm:ss');
  const formattedEndTime = DateTime.fromJSDate(now)
    .plus({ minutes: duration })
    .toFormat('HH:mm:ss');

  const minutesOfStartTime = DateTime.fromJSDate(now).toSeconds().toFixed(0);
  const minutesOfEndTime = DateTime.fromJSDate(now)
    .plus({ minutes: duration })
    .toSeconds()
    .toFixed(0);

  return [
    {
      alertDescriptionTextTranslations: [
        {
          language: 'en',
          text: `This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}.  This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. `,
        },
      ],
      alertHeaderText: 'Header text for dummy alert',
      alertHeaderTextTranslations: [
        {
          language: 'en',
          text: `This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. This test alert is effective between ${formattedStartTime} and ${formattedEndTime}. `,
        },
      ],
      alertSeverityLevel: 'SEVERE',
      effectiveStartDate: minutesOfStartTime,
      effectiveEndDate: minutesOfEndTime,
      stop: null,
    },
  ];
};
