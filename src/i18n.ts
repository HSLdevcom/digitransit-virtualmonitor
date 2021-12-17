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
        breadCrumbsFrontPage: 'Frontpage',
        breadCrumbsHelp: 'Help',
        breadCrumbsModify: 'Edit the stop display',
        breadCrumbsOwnMonitors: 'My stop displays',
        breadCrumbsSite: 'Journey Planner',
        cancel: 'Cancel',
        cancelled: 'Cancelled',
        changeLanguage: 'Change language to {{language}}',
        chooseOne: 'Select at least one',
        close: 'Close',
        closedStop: 'Stop closed',
        closedStopWithRange:
          'Stop {{name}} {{code}} closed between {{startTime}} and {{endTime}}',
        continue: 'Continue',
        createViewTitle: 'Creation of a new view',
        deleteRenamings: 'Clear text changes',
        deleteStop: 'Remove stop {{stop}}',
        deleteView: 'Remove stop display {{id}}',
        departureTime: 'Time/min',
        destination: 'Destination',
        displayDirection: 'Direction of the display',
        displayEditorStaticLink: 'Create view',
        displayLanguage: 'Language',
        displayLanguages: 'Languages',
        duration: 'Duration / language',
        'edit-display': 'Edit display',
        frontPageParagraph1:
          'Create your own display and select the stops and routes you are interested in',
        frontPageParagraph2:
          'You can use the service to generate timetables for nearby stops to be displayed in public spaces, on your information displays or on company intranet.',
        frontPageParagraph3:
          'Displaying public transport timetables in prominent places encourages the use of public transport and makes it easier. In addition to timetables, the service provides you with service updates and disruption alerts.',
        headerSideLeft: 'Left column',
        headerSideRight: 'Right column',
        hideAllLines: 'Hide all routes',
        hideLine: 'Hide route {{line}}',
        hideLines: 'Hide routes {{hidden}} / {{all}}',
        horizontal: 'Horizontal',
        languageCode: 'en',
        languageNameEn: 'English',
        languageNameFi: 'Finnish',
        languageNameSv: 'Swedish',
        languageSelection: 'Language selection',
        layout: 'Layout',
        layoutEastWest: 'Eastward/Westward',
        layoutModalHeader: 'Select layout',
        lineId: 'Route',
        links: 'Links',
        loading: 'Loading...',
        loadingInfo: 'Loading...',
        menuClose: 'Close the main menu',
        menuOpen: 'Open the main menu',
        modify: 'Edit',
        moveStopToLeftCol: 'Move stop {{stop}} to the left column',
        moveStopToRightCol: 'Move stop {{stop}} to the right column',
        moveViewDown: 'Move stop display {{id}} down',
        moveViewUp: 'Move stop display {{id}} up',
        'no-departures': 'No known departures',
        noMonitors: 'No stop displays found',
        notPossibleToCreate:
          'Unable to create a new view without {{requirements}}',
        notPossibleToPreview:
          'Unable to display the preview without {{requirements}}',
        notPossibleToSave: 'Unable to save the view without {{requirements}}',
        'one-column': 'One column',
        or: 'or',
        placeholderSideLeft: 'No stops selected',
        placeholderSideRight: 'No stops selected',
        'platform-or-stop': 'Platform/Stop',
        prepareDisplay: 'Add new stop view',
        prepareStop: 'Add stop',
        preview: 'Preview',
        previewView: 'Preview',
        quickDisplayCreate: 'Create a stop display',
        renameDestinations: 'Edit destination',
        requirementLanguage: 'a language',
        requirementStop: 'a stop',
        save: 'Save',
        'search-autosuggest-label':
          'Place, route and stop search. Navigate with arrow keys, press Enter to select',
        'search-autosuggest-len': '{{count}} suggestion found',
        'search-autosuggest-len_plural': '{{count}} suggestions found',
        'search-current-suggestion': 'Current selection: {{selection}}',
        settingsChanged: 'Settings changed',
        show: 'Show',
        showEndOfLine: 'Routes terminating at this stop',
        showRouteColumn: 'Route column',
        showStopNumber: 'Stop or platform number',
        showVia: 'Via information, if available',
        sideLeft: 'Left headline',
        sideRight: 'Right headline',
        simple: 'Simple',
        'skip-to-main-content': 'Go to the main content of this page',
        staticMonitorTitle: 'Name of the display',
        stop: 'Stop',
        stopSettings: 'Settings for stop {{stop}} ({{code}})',
        stoptitle: 'Name of the stop view',
        tighten: 'Convergent',
        timeShift: 'Filter departures by time',
        timeShiftDescription:
          'You can exclude departures that are too soon to catch from the location of the stop display.',
        timeShiftShow: 'Only show departures departing in more than',
        'two-columns': 'Two columns',
        'two-columns-combo': 'Combination based on two columns',
        vertical: 'Vertical',
        viewEditorName: 'Name of the view',
      },
    },
    fi: {
      translations: {
        'add-at-least-one-stop': 'Lisää vähintään yksi pysäkki',
        all: 'Kaikki',
        arriveTerminal: 'Saapuu / Päätepysäkki',
        autosuggestPlaceHolder: 'Pysäkin nimi tai numero',
        breadCrumbsCreate: 'Luo pysäkkinäyttö',
        breadCrumbsFrontPage: 'Etusivu',
        breadCrumbsHelp: 'Apua',
        breadCrumbsModify: 'Muokkaa pysäkkinäyttöä',
        breadCrumbsOwnMonitors: 'Omat pysäkkinäytöt',
        breadCrumbsSite: 'Reittiopas',
        cancel: 'Peruuta',
        cancelled: 'Peruttu',
        changeLanguage: 'Vaihda kieleen {{language}}',
        chooseOne: 'Valitse vähintään yksi',
        close: 'Sulje',
        closedStop: 'Pysäkki suljettu',
        closedStopWithRange:
          'Pysäkki {{name}} {{code}} suljettu aikavälillä {{startTime}} - {{endTime}}',
        continue: 'Jatka',
        createViewTitle: 'Uuden näkymän luonti',
        deleteRenamings: 'Tyhjennä tekstimuutokset',
        deleteStop: 'Poista pysäkki {{stop}}',
        deleteView: 'Poista pysäkkinäkymä {{id}}',
        departureTime: 'Aika/min',
        destination: 'Määränpää',
        displayDirection: 'Näytön suunta',
        displayEditorStaticLink: 'Luo näkymä',
        displayLanguage: 'Esityskieli',
        displayLanguages: 'Esityskielet',
        duration: 'Kesto / esityskieli',
        'edit-display': 'Muokkaa näyttöä',
        frontPageParagraph1:
          'Luo itsellesi oma näyttö ja valitse pysäkit ja linjat joiden aikatauluista olet kiinnostunut',
        frontPageParagraph2:
          'Palvelulla voi tuoda esimerkiksi julkisten tilojen auloihin, yritysten infonäytöille tai intranet-verkkoon kyseisen paikan läheisyydessä olevien pysäkkien aikataulut.',
        frontPageParagraph3:
          'Joukkoliikenteen aikataulut näkyvällä paikalla helpottavat joukkoliikenteen käyttöä ja kannustavat käyttämään joukkoliikennettä. Aikataulujen lisäksi palvelun kautta saat myös ajankohtaiset liikenne- ja häiriötiedotteet.',
        headerSideLeft: 'Vasen palsta',
        headerSideRight: 'Oikea palsta',
        hideAllLines: 'Piilota kaikki linjat',
        hideLine: 'Piilota linja {{line}}',
        hideLines: 'Piilota linjoja {{hidden}} / {{all}}',
        horizontal: 'Vaaka',
        languageCode: 'fi',
        languageNameEn: 'Englanti',
        languageNameFi: 'Suomi',
        languageNameSv: 'Ruotsi',
        languageSelection: 'Kielen valinta',
        layout: 'Asettelu',
        layoutEastWest: 'Itään/länteen',
        layoutModalHeader: 'Valitse asettelutapa',
        lineId: 'Linja',
        links: 'Linkit',
        loading: 'Ladataan…',
        loadingInfo: 'Ladataan…',
        menuClose: 'Sulje päävalikko',
        menuOpen: 'Avaa päävalikko',
        modify: 'Muokkaa',
        moveStopToLeftCol: 'Siirrä pysäkki {{stop}} vasempaan palstaan',
        moveStopToRightCol: 'Siirrä pysäkki {{stop}} oikeaan palstaan',
        moveViewDown: 'Siirrä pysäkkinäkymä {{id}} alemmaksi',
        moveViewUp: 'Siirrä pysäkkinäkymä {{id}} ylemmäksi',
        'no-departures': 'Ei tiedossa olevia lähtöjä',
        noMonitors: 'Pysäkkinäyttöä ei löytynyt',
        notPossibleToCreate: 'Ilman {{requirements}} ei voida luoda näkymää',
        notPossibleToPreview:
          'Ilman {{requirements}} ei voida näyttää esikatselua',
        notPossibleToSave: 'Ilman {{requirements}} ei voida tallentaa näkymää',
        'one-column': 'Yksijakoinen',
        or: 'tai',
        placeholderSideLeft: 'Ei valittuja pysäkkejä',
        placeholderSideRight: 'Ei valittuja pysäkkejä',
        'platform-or-stop': 'Lait./Pys.',
        prepareDisplay: 'Lisää uusi pysäkkinäkymä',
        prepareStop: 'Lisää pysäkki',
        preview: 'Esikatselu',
        previewView: 'Esikatsele',
        quickDisplayCreate: 'Luo pysäkkinäyttö',
        renameDestinations: 'Muokkaa määränpää-tekstejä',
        requirementLanguage: 'kieltä',
        requirementStop: 'pysäkkiä',
        save: 'Tallenna',
        'search-autosuggest-label':
          'Paikka, linja ja pysäkkihaku. Navigoi listassa nuolinäppäimillä ja valitse enterillä',
        'search-autosuggest-len': 'Löydettiin {{count}} ehdotus',
        'search-autosuggest-len_plural': 'Löydettiin {{count}} ehdotusta',
        'search-current-suggestion': 'Tämänhetkinen valinta: {{selection}}',
        settingsChanged: 'Muutettuja asetuksia',
        show: 'Näytä',
        showEndOfLine: 'Linjat, joille tämä on päätepysäkki',
        showRouteColumn: 'Linja-sarake',
        showStopNumber: 'Pysäkki- tai laiturinumero',
        showVia: 'Kauttakulkutieto (via), jos saatavilla',
        sideLeft: 'Vasen otsikko',
        sideRight: 'Oikea otsikko',
        simple: 'Yksinkertainen',
        'skip-to-main-content': 'Siirry sivun pääsisältöön',
        staticMonitorTitle: 'Näytön nimi',
        stop: 'Pysäkki',
        stopSettings: 'Pysäkin {{stop}} {{code}} asetukset',
        stoptitle: 'Pysäkkinäkymän nimi',
        tighten: 'Tiivistyvä',
        timeShift: 'Rajaa lähtöjä ajan mukaan',
        timeShiftDescription:
          'Voit rajata esityksestä lähdöt, joihin pysäkkinäytön sijainnista ei\nole mahdollista ehtiä kyytiin.',
        timeShiftShow: 'Näytä vain lähdöt, joiden lähtöön on yli',
        'two-columns': 'Kaksijakoinen',
        'two-columns-combo': 'Kaksijakoinen yhdistelmä',
        vertical: 'Pysty',
        viewEditorName: 'Näkymän nimi',
      },
    },
    sv: {
      translations: {
        'add-at-least-one-stop': 'Lägg till åtminstone en hållplats',
        all: 'Alla',
        arriveTerminal: 'Anländer / Ändhållplats',
        autosuggestPlaceHolder: 'Hållplatsens namn eller nummer',
        breadCrumbsCreate: 'Skapa hållplatsskärm',
        breadCrumbsFrontPage: 'Framsidan',
        breadCrumbsHelp: 'Hjälp',
        breadCrumbsModify: 'Redigera hållplatsskärmen',
        breadCrumbsOwnMonitors: 'Mina hållplatsskärmar',
        breadCrumbsSite: 'Reseplaneraren',
        cancel: 'Ångra',
        cancelled: 'Inställt',
        changeLanguage: 'Byt språket till {{language}}',
        chooseOne: 'Välj åtminstone ett språk',
        close: 'Stäng',
        closedStop: 'Hållplats indragen',
        closedStopWithRange:
          'Hållplats {{name}} {{code}} indragen mellan {{startTime}} - {{endTime}}',
        continue: 'Fortsätt',
        createViewTitle: 'Skapa ny vy',
        deleteRenamings: 'Rensa alla textändringar',
        deleteStop: 'Ta bort hållplats {{stop}}',
        deleteView: 'Ta bort hållplatsvy {{id}}',
        departureTime: 'Tid/min',
        destination: 'Destination',
        displayDirection: 'Skärmens riktning',
        displayEditorStaticLink: 'Skapa vy',
        displayLanguage: 'Språk',
        displayLanguages: 'Språk',
        duration: 'Tid / språk',
        'edit-display': 'Redigera skärmen',
        frontPageParagraph1:
          'Skapa dig en egen skärm och välj de hållplatser och linjer som intresserar dig',
        frontPageParagraph2:
          'Med tjänsten kan du visa tidtabeller för närmaste hållplatser t.ex. i offentliga lokaler, på digitala informationsskärmar eller på företagets intranät.',
        frontPageParagraph3:
          'Kollektivtrafikens tidtabeller på synliga platser gör det lättare att resa kollektivt och uppmuntrar att använda kollektivtrafiktjänster. Genom tjänsten får du även aktuella trafikmeddelanden och information om trafikstörningar.',
        headerSideLeft: 'Vänstra kolumnen',
        headerSideRight: 'Högra kolumnen',
        hideAllLines: 'Dölj alla linjer',
        hideLine: 'Dölj linje {{line}}',
        hideLines: 'Dölj linjer {{hidden}} / {{all}}',
        horizontal: 'Horisontell',
        languageCode: 'sv',
        languageNameEn: 'engelska',
        languageNameFi: 'finska',
        languageNameSv: 'svenska',
        languageSelection: 'Språkval',
        layout: 'Justering',
        layoutEastWest: 'Österut/söderut',
        layoutModalHeader: 'Välj justering',
        lineId: 'Linje',
        links: 'Länkar',
        loading: 'Laddar...',
        loadingInfo: 'Laddar...',
        menuClose: 'Stäng huvudmenyn',
        menuOpen: 'Öppna huvudmenyn',
        modify: 'Redigera',
        moveStopToLeftCol: 'Flytta hållplats {{stop}} till vänstra kolumnen',
        moveStopToRightCol: 'Flytta hållplats {{stop}} till högra kolumnen',
        moveViewDown: 'Flytta hållplatsvy {{id}} nedåt',
        moveViewUp: 'Flytta hållplatsvy {{id}} uppåt',
        'no-departures': 'Inga kända avgångar',
        noMonitors: 'Ingen hållplatsskärm hittades',
        notPossibleToCreate: 'Vyn kan inte skapas utan {{requirements}}',
        notPossibleToPreview:
          'Förhandsgranskning kan inte visas utan {{requirements}}',
        notPossibleToSave: 'Vyn kan inte sparas utan {{requirements}}',
        'one-column': 'En kolumn',
        or: 'eller',
        placeholderSideLeft: 'Inga valda hållplatser',
        placeholderSideRight: 'Inga valda hållplatser',
        'platform-or-stop': 'Plattf./Hållpl.',
        prepareDisplay: 'Lägg till ny hållplatsskärm',
        prepareStop: 'Lägg till hållplats',
        preview: 'Förhandsgranskning',
        previewView: 'Förhandsgranska',
        quickDisplayCreate: 'Skapa hållplatsskärm',
        renameDestinations: 'Redigera destination',
        requirementLanguage: 'språk',
        requirementStop: 'hållplats',
        save: 'Spara',
        'search-autosuggest-label':
          'Plats, linje och hållplatssökning. Navigera i listan med hjälp av piltangenterna. Välj genom att trycka på Enter.',
        'search-autosuggest-len': '{{count}} förslag hittades',
        'search-autosuggest-len_plural': '{{count}} förslag hittades',
        'search-current-suggestion': 'Nuvarande val: {{selection}}',
        settingsChanged: 'Inställningarna ändrats',
        show: 'Visa',
        showEndOfLine: 'Linjerna som har den här hållplatsen som ändhållplats',
        showRouteColumn: 'Linjekolumn',
        showStopNumber: 'Hållplats- eller plattformsnummer',
        showVia: 'Via-information, om tillgänglig',
        sideLeft: 'Vänstra rubriken',
        sideRight: 'Högra rubriken',
        simple: 'Enkel',
        'skip-to-main-content': 'Gå till sidans huvudinnehåll',
        staticMonitorTitle: 'Skärmens namn',
        stop: 'Hållplats',
        stopSettings: 'Inställningar för hållplats {{stop}} ({{code}})',
        stoptitle: 'Hållplatsskärmens namn',
        tighten: 'Förtätad',
        timeShift: 'Välja bort avgångar baserat på tid',
        timeShiftDescription:
          'Du kan välja bort de avgångstider som inte är anpassade till dig.',
        timeShiftShow: 'Visa endast avgångar som avgår om minst',
        'two-columns': 'Två kolumner',
        'two-columns-combo': 'Kombination av två kolumner',
        vertical: 'Vertikal',
        viewEditorName: 'Vyns namn',
      },
    },
  },
});

export default i18n;
