import i18n from 'i18next';

i18n.init({
  debug: false,
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
        'add-at-least-one-stop': 'Add at least one stop',
        all: 'All',
        arriveTerminal: 'Arrives / Terminus',
        autosuggestPlaceHolder: 'Name or number of the stop',
        breadCrumbsCreate: 'Create a stop display',
        breadCrumbsHelp: 'Help',
        breadCrumbsModify: 'Edit the stop display',
        breadCrumbsOwnMonitors: 'My stop displays',
        breadCrumbsSite: 'Journey Planner',
        cancel: 'Cancel',
        cancelled: 'Cancelled',
        chooseOne: 'Select at least one',
        closedStop: 'Stop closed',
        closedStopWithRange:
          'Stop {{name}} {{code}} closed between {{startTime}} and {{endTime}}',
        continue: 'Continue',
        createViewTitle: 'Creation of a new view',
        deleteRenamings: 'Clear text changes',
        departureTime: 'Time/min',
        destination: 'Destination',
        displayDirection: 'Direction of the display',
        displayEditorStaticLink: 'Create view',
        displayLanguage: 'Languages',
        duration: 'Duration / language',
        'edit-display': 'Edit display',
        endOfLine: 'Routes terminating at this stop',
        frontPageParagraph1:
          'Create a virtual stop display for your phone or computer and select which stops and routes you are interested in.',
        frontPageParagraph2:
          'You can also use the service to generate timetables for nearby stops to be displayed in public spaces or on company intranet.',
        frontPageParagraph3:
          'Displaying public transport timetables in prominent places encourages the use of public transport. In addition to timetables, the service provides you with service updates and disruption alerts.',
        headerSideLeft: 'Left column',
        headerSideRight: 'Right column',
        hideLines: 'Hide routes',
        horizontal: 'Horizontal',
        languageCode: 'en',
        layout: 'Layout',
        layoutEastWest: 'Eastward/Westward',
        layoutModalHeader: 'Select layout',
        lineId: 'Route',
        loading: 'Loading...',
        loadingInfo: 'Loading...',
        modify: 'Edit',
        'no-departures': 'No known departures',
        placeholderSideLeft: 'No stops selected',
        placeholderSideRight: 'No stops selected',
        'platform-or-stop': 'Platform/Stop',
        prepareDisplay: 'Add new stop view',
        prepareStop: 'Add stop',
        preview: 'Preview',
        previewView: 'Preview',
        quickDisplayCreate: 'Create a stop display',
        renameDestinations: 'Edit destination',
        save: 'Save',
        'search-autosuggest-label':
          'Place, route and stop search. Navigate with arrow keys, press Enter to select',
        'search-autosuggest-len': '{{count}} suggestion found',
        'search-autosuggest-len_plural': '{{count}} suggestions found',
        'search-current-suggestion': 'Current selection: {{selection}}',
        settingsChanged: 'Settings changed',
        show: 'Show',
        showRouteColumn: 'Route column',
        showVia: 'Via information, if available',
        sideLeft: 'Left headline',
        sideRight: 'Right headline',
        staticMonitorTitle: 'Name of the display',
        stop: 'Stop',
        stopCodeOrPlatformNumber: 'Stop or platform number',
        stopSettings: 'Settings for stop {{stop}} ({{code}})',
        stoptitle: 'Name of the stop view',
        timeShift: 'Filter departures by time',
        timeShiftDescription:
          'You can exclude departures that are too soon to catch from the location of the stop display.',
        timeShiftShow: 'Only show departures departing in more than',
        vertical: 'Vertical',
        viewEditorName: 'Name of the view',
        breadCrumbsFrontPage: 'Frontpage',
        changeLanguage: 'Change language to {{language}}',
        close: 'Close',
        languageNameEn: 'English',
        languageNameFi: 'Finnish',
        languageNameSv: 'Swedish',
        languageSelection: 'Language selection',
        links: 'Links',
        menuClose: 'Close the main menu',
        menuOpen: 'Open the main menu',
        noMonitors: 'No stop monitors was found',
        'skip-to-main-content': 'Go to the main content of this page',
        'one-column': 'One column',
        'two-columns': 'Two columns',
        'two-columns-combo': 'Two columns combination',
        simple: 'Simple',
        tighten: 'Tighten',
      },
    },
    fi: {
      translations: {
        'add-at-least-one-stop': 'Lisää vähintään yksi pysäkki',
        all: 'Kaikki',
        arriveTerminal: 'Saapuu / Päätepysäkki',
        autosuggestPlaceHolder: 'Pysäkin nimi tai numero',
        breadCrumbsCreate: 'Luo pysäkkinäyttö',
        breadCrumbsHelp: 'Apua',
        breadCrumbsModify: 'Muokkaa pysäkkinäyttöä',
        breadCrumbsOwnMonitors: 'Omat pysäkkinäytöt',
        breadCrumbsSite: 'Reittiopas',
        cancel: 'Peruuta',
        cancelled: 'Peruttu',
        chooseOne: 'Valitse vähintään yksi',
        closedStop: 'Pysäkki suljettu',
        closedStopWithRange:
          'Pysäkki {{name}} {{code}} suljettu aikavälillä {{startTime}} - {{endTime}}',
        continue: 'Jatka',
        createViewTitle: 'Uuden näkymän luonti',
        deleteRenamings: 'Tyhjennä tekstimuutokset',
        departureTime: 'Aika/min',
        destination: 'Määränpää',
        displayDirection: 'Näytön suunta',
        displayEditorStaticLink: 'Luo näkymä',
        displayLanguage: 'Esityskielet',
        duration: 'Kesto / esityskieli',
        'edit-display': 'Muokkaa näyttöä',
        endOfLine: 'Linjat, joille tämä on päätepysäkki',
        frontPageParagraph1:
          'Luo itsellesi puhelimen tai tietokoneen ruudulla näkyvä pysäkkinäyttö ja valitse minkä pysäkkien ja linjojen aikatauluista olet kiinnostunut.',
        frontPageParagraph2:
          'Palvelulla voi tuottaa myös julkisten tilojen auloihin tai yritysten intranet-verkkoon kyseisen paikan läheisyydessä olevien pysäkkien aikataulut.',
        frontPageParagraph3:
          'Joukkoliikenteen aikataulut näkyvällä paikalla kannustavat käyttämään joukkoliikennettä ja aikataulujen lisäksi palvelun kautta saat myös liikenne- ja häiriötiedotteet.',
        headerSideLeft: 'Vasen palsta',
        headerSideRight: 'Oikea palsta',
        hideLines: 'Piilota linjoja',
        horizontal: 'Vaaka',
        languageCode: 'fi',
        layout: 'Asettelu',
        layoutEastWest: 'Itään/länteen',
        layoutModalHeader: 'Valitse asettelutapa',
        lineId: 'Linja',
        loading: 'Ladataan…',
        loadingInfo: 'Ladataan…',
        modify: 'Muokkaa',
        'no-departures': 'Ei tiedossa olevia lähtöjä',
        placeholderSideLeft: 'Ei valittuja pysäkkejä',
        placeholderSideRight: 'Ei valittuja pysäkkejä',
        'platform-or-stop': 'Lait./Pys.',
        prepareDisplay: 'Lisää uusi pysäkkinäkymä',
        prepareStop: 'Lisää pysäkki',
        preview: 'Esikatselu',
        previewView: 'Esikatsele',
        quickDisplayCreate: 'Luo pysäkkinäyttö',
        renameDestinations: 'Muokkaa määränpää-tekstejä',
        save: 'Tallenna',
        'search-autosuggest-label':
          'Paikka, linja ja pysäkkihaku. Navigoi listassa nuolinäppäimillä ja valitse enterillä',
        'search-autosuggest-len': 'Löydettiin {{count}} ehdotus',
        'search-autosuggest-len_plural': 'Löydettiin {{count}} ehdotusta',
        'search-current-suggestion': 'Tämänhetkinen valinta: {{selection}}',
        settingsChanged: 'Muutettuja asetuksia',
        show: 'Näytä',
        showRouteColumn: 'Linja-sarake',
        showVia: 'Kauttakulkutieto (via), jos saatavilla',
        sideLeft: 'Vasen otsikko',
        sideRight: 'Oikea otsikko',
        staticMonitorTitle: 'Näytön nimi',
        stop: 'Pysäkki',
        stopCodeOrPlatformNumber: 'Pysäkki- tai laiturinumero',
        stopSettings: 'Pysäkin {{stop}} {{code}} asetukset',
        stoptitle: 'Pysäkkinäkymän nimi',
        timeShift: 'Rajaa lähtöjä ajan mukaan',
        timeShiftDescription:
          'Voit rajata esityksestä lähdöt, joihin pysäkkinäytön sijainnista ei\nole mahdollista ehtiä kyytiin.',
        timeShiftShow: 'Näytä vain lähdöt, joiden lähtöön on yli',
        vertical: 'Pysty',
        viewEditorName: 'Näkymän nimi',
        breadCrumbsFrontPage: 'Etusivu',
        changeLanguage: 'Vaihda kieleen {{language}}',
        close: 'Sulje',
        languageNameEn: 'Englanti',
        languageNameFi: 'Suomi',
        languageNameSv: 'Ruotsi',
        languageSelection: 'Kielen valinta',
        links: 'Linkit',
        menuClose: 'Sulje päävalikko',
        menuOpen: 'Avaa päävalikko',
        noMonitors: 'Pysäkkinäyttöä ei löytynyt',
        'skip-to-main-content': 'Siirry sivun pääsisältöön',
        'one-column': 'Yksijakoinen',
        'two-columns': 'Kaksijakoinen',
        'two-columns-combo': 'Kaksijakoinen yhdistelmä',
        simple: 'Yksinkertainen',
        tighten: 'Tiivistyvä',
      },
    },
    sv: {
      translations: {
        'add-at-least-one-stop': 'Lägg till åtminstone en hållplats',
        all: 'Alla',
        arriveTerminal: 'Anländer / Ändhållplats',
        autosuggestPlaceHolder: 'Hållplatsens namn eller nummer',
        breadCrumbsCreate: 'Skapa hållplatsskärm',
        breadCrumbsHelp: 'Hjälp',
        breadCrumbsModify: 'Redigera hållplatsskärmen',
        breadCrumbsOwnMonitors: 'Mina hållplatsskärmar',
        breadCrumbsSite: 'Reseplaneraren',
        cancel: 'Ångra',
        cancelled: 'Inställt',
        chooseOne: 'Välj åtminstone ett språk',
        closedStop: 'Hållplats indragen',
        closedStopWithRange:
          'Hållplats {{name}} {{code}} indragen mellan {{startTime}} - {{endTime}}',
        continue: 'Fortsätt',
        createViewTitle: 'Skapa ny vy',
        deleteRenamings: 'Rensa alla textändringar',
        departureTime: 'Tid/min',
        destination: 'Destination',
        displayDirection: 'Skärmens riktning',
        displayEditorStaticLink: 'Skapa vy',
        displayLanguage: 'Språk',
        duration: 'Tid / språk',
        'edit-display': 'Redigera skärmen',
        endOfLine: 'Linjerna som har den här hållplatsen som ändhållplats',
        frontPageParagraph1:
          'Skapa en virtuell hållplatsskärm för din mobiltelefon eller dator som visar tidtabeller för de hållplatser och linjer som intresserar dig.',
        frontPageParagraph2:
          'Genom tjänsten är det också möjligt att visa tidtabeller för kollektivtrafikens närmaste hållplatser i offentliga lokaler och på företagets intranät.',
        frontPageParagraph3:
          'Kollektivtrafikens tidtabeller på synliga platser uppmuntrar att använda kollektivtrafiktjänster. Genom tjänsten får du också trafikmeddelanden och information om trafikstörningar.',
        headerSideLeft: 'Vänstra kolumnen',
        headerSideRight: 'Högra kolumnen',
        hideLines: 'Dölj linjer',
        horizontal: 'Horisontell',
        languageCode: 'sv',
        layout: 'Justering',
        layoutEastWest: 'Österut/söderut',
        layoutModalHeader: 'Välj justering',
        lineId: 'Linje',
        loading: 'Laddar...',
        loadingInfo: 'Laddar...',
        modify: 'Redigera',
        'no-departures': 'Inga kända avgångar',
        placeholderSideLeft: 'Inga valda hållplatser',
        placeholderSideRight: 'Inga valda hållplatser',
        'platform-or-stop': 'Plattf./Hållpl.',
        prepareDisplay: 'Lägg till ny hållplatsskärm',
        prepareStop: 'Lägg till hållplats',
        preview: 'Förhandsgranskning',
        previewView: 'Förhandsgranska',
        quickDisplayCreate: 'Skapa hållplatsskärm',
        renameDestinations: 'Redigera destination',
        save: 'Spara',
        'search-autosuggest-label':
          'Plats, linje och hållplatssökning. Navigera i listan med hjälp av piltangenterna. Välj genom att trycka på Enter.',
        'search-autosuggest-len': '{{count}} förslag hittades',
        'search-autosuggest-len_plural': '{{count}} förslag hittades',
        'search-current-suggestion': 'Nuvarande val: {{selection}}',
        settingsChanged: 'Inställningarna ändrats',
        show: 'Visa',
        showRouteColumn: 'Linjekolumn',
        showVia: 'Via-information, om tillgänglig',
        sideLeft: 'Vänstra rubriken',
        sideRight: 'Högra rubriken',
        staticMonitorTitle: 'Skärmens namn',
        stop: 'Hållplats',
        stopCodeOrPlatformNumber: 'Hållplats- eller plattformsnummer',
        stopSettings: 'Inställningar för hållplats {{stop}} ({{code}})',
        stoptitle: 'Hållplatsskärmens namn',
        timeShift: 'Välja bort avgångar baserat på tid',
        timeShiftDescription:
          'Du kan välja bort de avgångstider som inte är anpassade till dig.',
        timeShiftShow: 'Visa endast avgångar som avgår om minst',
        vertical: 'Vertikal',
        viewEditorName: 'Vyns namn',
        breadCrumbsFrontPage: 'Framsidan',
        changeLanguage: 'Byta språket till {{language}}',
        close: 'Stäng',
        languageNameEn: 'engelska',
        languageNameFi: 'finska',
        languageNameSv: 'svenska',
        languageSelection: 'Språkval',
        links: 'Länkar',
        menuClose: 'Stäng huvudmenyn',
        menuOpen: 'Öppna huvudmenyn',
        noMonitors: 'TODO',
        'skip-to-main-content': 'Gå till sidans huvudinnehåll',
        'one-column': 'TODO',
        'two-columns': 'TODO',
        'two-columns-combo': 'TODO',
        simple: 'TODO',
        tighten: 'TODO',
      },
    },
  },
});

export default i18n;
