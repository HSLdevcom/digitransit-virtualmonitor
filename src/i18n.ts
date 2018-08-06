import * as i18n from 'i18next';

i18n
  .init({
    debug: true,
    defaultNS: 'translations',
    fallbackLng: 'fi',

    interpolation: {
      escapeValue: false,
    },

    lng: 'fi',

    ns: ['translations'],

    react: {
      nsMode: 'default',
      wait: false,
    },

    resources: {
      fi: {
        translations: {
          departureTime: 'Lähtöaika',
          destination: 'Määränpää',
          lineId: 'Linja',
        },
      },
    },
  });

export default i18n;
