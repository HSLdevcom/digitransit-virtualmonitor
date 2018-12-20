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
      en: {
        translations: {
          departureTime: 'Time',
          destination: 'Destination',
          lineId: 'Line',
        },
      },
      fi: {
        translations: {
          canceled: 'Peruttu',
          configuration: 'Konfiguraatio',
          departureTime: 'Lähtöaika',
          destination: 'Määränpää',
          display: 'Näyttö',
          latitude: 'Latitude',
          lineId: 'Linja',
          loading: 'Ladataan…',
          longitude: 'Longitude',
          noStopsDefined: 'Ei pysäkkejä määritettynä',
          pier: 'Laituri',
          prepareConfiguration: 'Lisää konfiguraatio',
          prepareDisplay: 'Lisää näyttö',
          prepareStop: 'Lisää pysäkki',
          stop: 'Pysäkki {{stop}}',
          stopRetrieveError: 'Virhe haettaessa pysäkkiä {{stopId}}',
          stopRetrieveNotFound: 'Haettua pysäkkiä {{stopId}} ei löytynyt',
          stopSearchError: 'Virhe haettaessa pysäkkiä stringillä {{searchPhrase}}',
          stopSearchNotFound: 'Haettua pysäkkiä stringillä {{searchPhrase}} ei löytynyt.',
          stopSearcher: 'Pysäkkietsin',
          stopSearcherDisplayedResultCount: 'Näytettävien reittien määrä',
          stopSearcherPhrase: 'Pysäkkihakusana',
          stopSearcherSearch: 'Etsi',
          stopSearcherSearching: 'Etsitään hakusanalla {{searchPhrase}}',
          titlebarTitle: 'Virtuaalimonitori',
          quickDisplayCreate: 'Luo uusi näyttö',
        },
      },
    },
  });

export default i18n;
