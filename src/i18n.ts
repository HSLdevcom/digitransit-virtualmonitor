import i18n from 'i18next';

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
          createViewTitle: 'Create new view',
          departureTime: 'Time',
          destination: 'Destination',
          lineId: 'Line',
          viewErrorUnknownView: 'Unknown view with title \'{{viewTitle}}\' of type {{viewType}}',
        },
      },
      fi: {
        translations: {
          arriveTerminal: 'Saapuu / Päätepysäkki',
          canceled: 'Peruttu',
          createViewTitle: 'Luo uusi näkymä',
          configuration: 'Konfiguraatio',
          departureTime: 'Lähtöaika',
          destination: 'Määränpää',
          display: 'Näyttö',
          displayEditorDefinePosition: 'Määritä sijainti',
          displayEditorNewView: 'Lisää uusi pysäkkinäkymä karuselliin',
          displayEditorStaticLink: 'Staattinen linkki',
          latitude: 'Latitude',
          lineId: 'Linja',
          loading: 'Ladataan…',
          loadingInfo: 'Ladataan…',
          longitude: 'Longitude',
          noStopsDefined: 'Ei pysäkkejä määritettynä',
          pier: 'Laituri',
          prepareConfiguration: 'Lisää konfiguraatio',
          prepareDisplay: 'Lisää näyttö',
          prepareStop: 'Lisää pysäkki',
          quickDisplayCreate: 'Luo uusi näyttö',
          seconds: 'sekuntia',
          stop: 'Pysäkki {{stop}}',
          stopCode: 'pysäkkinumero',
          stopName: 'Pysäkin nimi',
          stopRetrieveError: 'Virhe haettaessa pysäkkiä {{stopId}}',
          stopRetrieveNotFound: 'Haettua pysäkkiä {{stopId}} ei löytynyt',
          stopSearchError: 'Virhe haettaessa pysäkkiä stringillä {{searchPhrase}}',
          stopSearchNotFound: 'Haettua pysäkkiä stringillä {{searchPhrase}} ei löytynyt.',
          stopSearcher: 'Pysäkkietsin',
          stopSearcherDisplayedResultCount: 'Näytettävien reittien määrä',
          stopSearcherPhrase: 'Pysäkkihakusana',
          stopSearcherSearch: 'Etsi',
          stopSearcherSearching: 'Etsitään hakusanalla {{searchPhrase}}',
          stops: 'Pysäkit',
          titlebarTitle: 'Virtuaalimonitori',
          viewCarouselElementEditorDeleteView: 'Poista näkymä',
          viewCarouselElementEditorShownTime: 'Näytetty aika',
          viewCarouselElementEditorViewDisabled: 'Näkymä pois käytöstä.',
          viewEditorErrorStopNotFound: 'Pysäkkiä Id:llä {{stopId}} ei löytynyt.',
          viewEditorMoveStopDown: 'Siirrä tärkeysjärjestykessä alemmaksi',
          viewEditorMoveStopUp: 'Siirrä tärkeysjärjestykessä ylämmäksi',
          viewEditorName: 'Näkymän nimi',
          viewEditorRemoveStop: 'Poista pysäkki',
          viewEditorType: 'Näkymän tyyppi',
          viewErrorNoTitle: 'Nimeämätön näkymä',
          viewErrorUnknownView: 'Tuntematon näkymä \'{{viewTitle}}\' tyypillä {{viewType}}',
        },
      },
    },
  });

export default i18n;
