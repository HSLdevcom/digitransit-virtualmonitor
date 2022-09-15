import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: 'fi',
  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ['en', 'sv', 'fi'],
  lng: window.localStorage.getItem('lang') || 'fi',

  react: {
    nsMode: 'default',
    useSuspense: true,
  },

  resources: {
    en: {
      translation: {
        'add-at-least-one-stop': 'Add at least one stop',
        'add-to-own-displays': 'Lisää omiin näyttöihin',
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
        copy: 'Copy link',
        createViewTitle: 'Creation of a new view',
        delete: 'Delete',
        'delete-confirmation': 'Are you sure you want to delete this monitor',
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
        'front-page-no-sign-in-button': 'Continue without logging in',
        'front-page-sign-in-button': 'Log in and create a display',
        frontPageParagraph1:
          'Create your own display and select the stops and routes you are interested in',
        frontPageParagraph2:
          'You can use the service to generate timetables for nearby stops to be displayed in public spaces, on your information displays or on company intranet.',
        frontPageParagraph3:
          'Displaying public transport timetables in prominent places encourages the use of public transport and makes it easier. In addition to timetables, the service provides you with service updates and disruption alerts.',
        'front-page-paragraph-hsl':
          'When you log in using your HSL account before creating a display, you can later edit the display.',
        'header-side-left': 'Left column',
        'header-side-right': 'Right column',
        hideAllLines: 'Hide all routes',
        hideLine: 'Hide route {{line}}',
        hideLines: 'Hide routes {{hidden}} / {{all}}',
        horizontal: 'Horizontal',
        import: 'Import',
        'import-instructions':
          'Anna olemassaolevan pysäkkinäytön URL-osoite, niin voit lisätä sen omiin näyttöihisi',
        'import-monitor': 'Import a monitor',
        'info-display-only-one':
          'Voit valita tiedotenäytön vain näyttöön, jossa on yksi pysäkkinäkymä.',
        'info-text-short': 'Departures in a chronological order',
        'info-text-one-column':
          'Departures in a chronological order in one column',
        'info-text-two-columns':
          'Departures in a chronological order in two columns',
        'info-text-double': 'Display with two views',
        'information-display': 'Service update view',
        'information-display-info':
          'Displays service updates for selected stops and routes',
        languageCode: 'en',
        languageNameEn: 'English',
        languageNameFi: 'Finnish',
        languageNameSv: 'Swedish',
        languageSelection: 'Language selection',
        layout: 'Layout',
        'layout-double': 'Double view',
        layoutModalHeader: 'Select layout',
        lineId: 'Route',
        'link-copied': 'Linkki kopioitu leikepöydälle',
        links: 'Links',
        loading: 'Loading...',
        login: 'Log in',
        logout: 'Log out',
        menuClose: 'Close the main menu',
        menuOpen: 'Open the main menu',
        modify: 'Edit',
        moveStopToLeftCol: 'Move stop {{stop}} to the left column',
        moveStopToRightCol: 'Move stop {{stop}} to the right column',
        moveViewDown: 'Move stop display {{id}} down',
        moveViewUp: 'Move stop display {{id}} up',
        'new-display-disabled':
          'Et voi lisätä useampia näkymiä tiedotenäyttöön',
        'no-departures': 'No known departures',
        'no-monitor-found':
          'Antamallasi URL-osoitteella ei löytynyt yhtään monitoria.',
        'no-stops-selected': 'No stops selected',
        noMonitors: 'No stop displays found',
        noAlerts: 'No alerts found',
        'non-logged-in-monitor-info':
          'Olet muokkaamassa näyttöä, joka on luotu ilman kirjautumista. Voit tallentaa näytön omiin näyttöihisi.',
        notPossibleToCreate:
          'Unable to create a new view without {{requirements}}',
        notPossibleToPreview:
          'Unable to display the preview without {{requirements}}',
        notPossibleToSave: 'Unable to save the view without {{requirements}}',
        'one-column': 'One column',
        open: 'Open display',
        ok: 'OK',
        or: 'or',
        'platform-or-stop': 'Platform/Stop',
        prepareDisplay: 'Add new stop view',
        prepareStop: 'Add stop',
        preview: 'Preview',
        previewView: 'Preview',
        quickDisplayCreate: 'Create a stop display',
        renameDestinations: 'Edit destination',
        requirementLanguage: 'a language',
        requirementStop: 'a stop',
        rows: 'rows',
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
        sideleft: 'Left headline',
        sideright: 'Right headline',
        simple: 'Fixed height',
        'skip-to-main-content': 'Go to the main content of this page',
        staticMonitorTitle: 'Name of the display',
        stop: 'Stop',
        'stop-display': 'Pysäkkinäyttö',
        stopSettings: 'Settings for stop {{stop}} ({{code}})',
        stoptitle: 'Name of the stop view',
        tighten: 'Convergent',
        timeShift: 'Filter departures by time',
        timeShiftDescription:
          'You can exclude departures that are too soon to catch from the location of the stop display.',
        timeShiftShow: 'Only show departures departing in more than',
        'to-own-displays': 'Siirry omiin näyttöihin',
        'two-columns': 'Two columns',
        userinfo: 'My information',
        vertical: 'Vertical',
        viewEditorName: 'Name of the view',
      },
    },
    fi: {
      translation: {
        'add-at-least-one-stop': 'Lisää vähintään yksi pysäkki',
        'add-to-own-displays': 'Lisää omiin näyttöihin',
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
        copy: 'Kopioi linkki',
        createViewTitle: 'Uuden näkymän luonti',
        delete: 'Poista',
        'delete-confirmation':
          'Oletko varma, että haluat poistaa näytön "{{monitor}}"?',
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
        'front-page-no-sign-in-button': 'Jatka kirjautumatta',
        'front-page-sign-in-button': 'Kirjaudu ja luo näyttö',
        frontPageParagraph1:
          'Luo itsellesi oma näyttö ja valitse pysäkit ja linjat joiden aikatauluista olet kiinnostunut',
        frontPageParagraph2:
          'Palvelulla voi tuoda esimerkiksi julkisten tilojen auloihin, yritysten infonäytöille tai intranet-verkkoon kyseisen paikan läheisyydessä olevien pysäkkien aikataulut.',
        frontPageParagraph3:
          'Joukkoliikenteen aikataulut näkyvällä paikalla helpottavat joukkoliikenteen käyttöä ja kannustavat käyttämään joukkoliikennettä. Aikataulujen lisäksi palvelun kautta saat myös ajankohtaiset liikenne- ja häiriötiedotteet.',
        'front-page-paragraph-hsl':
          'Luo näyttö HSL-tunnuksella kirjautuneena niin pääset myöhemmin muokkaamaan luomaasi pysäkkinäyttöä.',
        'header-side-left': 'Vasen palsta',
        'header-side-right': 'Oikea palsta',
        hideAllLines: 'Piilota kaikki linjat',
        hideLine: 'Piilota linja {{line}}',
        hideLines: 'Piilota linjoja {{hidden}} / {{all}}',
        horizontal: 'Vaaka',
        import: 'Tuo',
        'import-instructions':
          'Anna olemassaolevan pysäkkinäytön URL-osoite, niin voit lisätä sen omiin näyttöihisi',
        'import-monitor': 'Tuo monitori',
        'info-display-only-one':
          'Voit valita tiedotenäytön vain näyttöön, jossa on yksi pysäkkinäkymä.',
        'info-text-short': 'Lähdöt aikajärjestyksessä',
        'info-text-one-column': 'Lähdöt aikajärjestyksessä yhdellä sarakkeella',
        'info-text-two-columns':
          'Lähdöt aikajärjestysessä kahdella sarakkeella',
        'info-text-double': 'Kaksi näkymää yhdellä näytöllä',
        'information-display': 'Tiedotenäyttö',
        'information-display-info':
          'Esittää tiedotteita valituista pysäkeistä ja linjoista',
        languageCode: 'fi',
        languageNameEn: 'Englanti',
        languageNameFi: 'Suomi',
        languageNameSv: 'Ruotsi',
        languageSelection: 'Kielen valinta',
        layout: 'Asettelu',
        'layout-double': 'Kaksoisnäkymä',
        layoutModalHeader: 'Valitse asettelutapa',
        lineId: 'Linja',
        'link-copied': 'Linkki kopioitu leikepöydälle',
        links: 'Linkit',
        loading: 'Ladataan…',
        login: 'Kirjaudu sisään',
        logout: 'Kirjaudu ulos',
        menuClose: 'Sulje päävalikko',
        menuOpen: 'Avaa päävalikko',
        modify: 'Muokkaa',
        moveStopToLeftCol: 'Siirrä pysäkki {{stop}} vasempaan palstaan',
        moveStopToRightCol: 'Siirrä pysäkki {{stop}} oikeaan palstaan',
        moveViewDown: 'Siirrä pysäkkinäkymä {{id}} alemmaksi',
        moveViewUp: 'Siirrä pysäkkinäkymä {{id}} ylemmäksi',
        'new-display-disabled':
          'Et voi lisätä useampia näkymiä tiedotenäyttöön',
        'no-departures': 'Ei tiedossa olevia lähtöjä',
        'no-monitor-found':
          'Antamallasi URL-osoitteella ei löytynyt yhtään monitoria.',
        'no-stops-selected': 'Ei valittuja pysäkkejä',
        noMonitors: 'Pysäkkinäyttöä ei löytynyt',
        noAlerts: 'Tiedotteita ei löytynyt',
        'non-logged-in-monitor-info':
          'Olet muokkaamassa näyttöä, joka on luotu ilman kirjautumista. Voit tallentaa näytön omiin näyttöihisi.',
        notPossibleToCreate: 'Ilman {{requirements}} ei voida luoda näkymää',
        notPossibleToPreview:
          'Ilman {{requirements}} ei voida näyttää esikatselua',
        notPossibleToSave: 'Ilman {{requirements}} ei voida tallentaa näkymää',
        'one-column': 'Yksi sarake',
        open: 'Avaa näyttö',
        ok: 'OK',
        or: 'tai',
        'platform-or-stop': 'Lait./Pys.',
        prepareDisplay: 'Lisää uusi pysäkkinäkymä',
        prepareStop: 'Lisää pysäkki',
        preview: 'Esikatselu',
        previewView: 'Esikatsele',
        quickDisplayCreate: 'Luo pysäkkinäyttö',
        renameDestinations: 'Muokkaa määränpää-tekstejä',
        requirementLanguage: 'kieltä',
        requirementStop: 'pysäkkiä',
        rows: 'riviä',
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
        sideleft: 'Vasen otsikko',
        sideright: 'Oikea otsikko',
        simple: 'Tasavälinen',
        'skip-to-main-content': 'Siirry sivun pääsisältöön',
        staticMonitorTitle: 'Näytön nimi',
        stop: 'Pysäkki',
        'stop-display': 'Pysäkkinäyttö',
        stopSettings: 'Pysäkin {{stop}} {{code}} asetukset',
        stoptitle: 'Pysäkkinäkymän nimi',
        tighten: 'Tiivistyvä',
        timeShift: 'Rajaa lähtöjä ajan mukaan',
        timeShiftDescription:
          'Voit rajata esityksestä lähdöt, joihin pysäkkinäytön sijainnista ei\nole mahdollista ehtiä kyytiin.',
        timeShiftShow: 'Näytä vain lähdöt, joiden lähtöön on yli',
        'to-own-displays': 'Siirry omiin näyttöihin',
        'two-columns': 'Kaksi saraketta',
        userinfo: 'Omat tiedot',
        vertical: 'Pysty',
        viewEditorName: 'Näkymän nimi',
      },
    },
    sv: {
      translation: {
        'add-at-least-one-stop': 'Lägg till åtminstone en hållplats',
        'add-to-own-displays': 'Lisää omiin näyttöihin',
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
        copy: 'Kopiera länken',
        createViewTitle: 'Skapa ny vy',
        delete: 'Ta bort',
        'delete-confirmation':
          'Är du säker på att du vill ta bort skärmen "{{monitor}}"?',
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
        'front-page-no-sign-in-button': 'Fortsätt utan att logga in',
        'front-page-sign-in-button': 'Logga in och skapa en skärmvy',
        frontPageParagraph1:
          'Skapa dig en egen skärm och välj de hållplatser och linjer som intresserar dig',
        frontPageParagraph2:
          'Med tjänsten kan du visa tidtabeller för närmaste hållplatser t.ex. i offentliga lokaler, på digitala informationsskärmar eller på företagets intranät.',
        frontPageParagraph3:
          'Kollektivtrafikens tidtabeller på synliga platser gör det lättare att resa kollektivt och uppmuntrar att använda kollektivtrafiktjänster. Genom tjänsten får du även aktuella trafikmeddelanden och information om trafikstörningar.',
        'front-page-paragraph-hsl':
          'Skapa en skärmvy genom att logga in med HRT-konto så du kan senare redigera hålplatsskärmvy du skapat.',
        'header-side-left': 'Vänstra kolumnen',
        'header-side-right': 'Högra kolumnen',
        hideAllLines: 'Dölj alla linjer',
        hideLine: 'Dölj linje {{line}}',
        hideLines: 'Dölj linjer {{hidden}} / {{all}}',
        horizontal: 'Horisontell',
        import: 'Import',
        'import-instructions':
          'Anna olemassaolevan pysäkkinäytön URL-osoite, niin voit lisätä sen omiin näyttöihisi',
        'import-monitor': 'Import a monitor',
        'info-display-only-one':
          'Voit valita tiedotenäytön vain näyttöön, jossa on yksi pysäkkinäkymä.',
        'info-text-short': 'Avgångarna i kronologisk ordning',
        'info-text-one-column': 'Avgångarna i kronologisk ordning i en kolumn',
        'info-text-two-columns':
          'Avgångarna i kronologisk ordning i två kolumner',
        'info-text-double': 'Två vyer i en och samma display',
        'information-display': 'Informationsskärm',
        'information-display-info':
          'Visar meddelanden om de valda hållplatserna och linjerna',
        languageCode: 'sv',
        languageNameEn: 'engelska',
        languageNameFi: 'finska',
        languageNameSv: 'svenska',
        languageSelection: 'Språkval',
        layout: 'Justering',
        'layout-double': 'Dubbelvy',
        layoutModalHeader: 'Välj justering',
        lineId: 'Linje',
        'link-copied': 'Linkki kopioitu leikepöydälle',
        links: 'Länkar',
        loading: 'Laddar...',
        login: 'Logga in',
        logout: 'Logga ut',
        menuClose: 'Stäng huvudmenyn',
        menuOpen: 'Öppna huvudmenyn',
        modify: 'Redigera',
        moveStopToLeftCol: 'Flytta hållplats {{stop}} till vänstra kolumnen',
        moveStopToRightCol: 'Flytta hållplats {{stop}} till högra kolumnen',
        moveViewDown: 'Flytta hållplatsvy {{id}} nedåt',
        moveViewUp: 'Flytta hållplatsvy {{id}} uppåt',
        'new-display-disabled':
          'Et voi lisätä useampia näkymiä tiedotenäyttöön',
        'no-departures': 'Inga kända avgångar',
        'no-monitor-found':
          'Antamallasi URL-osoitteella ei löytynyt yhtään monitoria.',
        'no-stops-selected': 'Inga valda hållplatser',
        noMonitors: 'Ingen hållplatsskärm hittades',
        noAlerts: 'Ingen information om trafikstörningar hittades',
        'non-logged-in-monitor-info':
          'Olet muokkaamassa näyttöä, joka on luotu ilman kirjautumista. Voit tallentaa näytön omiin näyttöihisi.',
        notPossibleToCreate: 'Vyn kan inte skapas utan {{requirements}}',
        notPossibleToPreview:
          'Förhandsgranskning kan inte visas utan {{requirements}}',
        notPossibleToSave: 'Vyn kan inte sparas utan {{requirements}}',
        'one-column': 'En kolumn',
        open: 'Öppna skärmen',
        ok: 'OK',
        or: 'eller',
        'platform-or-stop': 'Plattf./Hållpl.',
        prepareDisplay: 'Lägg till ny hållplatsskärm',
        prepareStop: 'Lägg till hållplats',
        preview: 'Förhandsgranskning',
        previewView: 'Förhandsgranska',
        quickDisplayCreate: 'Skapa hållplatsskärm',
        renameDestinations: 'Redigera destination',
        requirementLanguage: 'språk',
        requirementStop: 'hållplats',
        rows: 'rader',
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
        sideleft: 'Vänstra rubriken',
        sideright: 'Högra rubriken',
        simple: 'Likformig',
        'skip-to-main-content': 'Gå till sidans huvudinnehåll',
        staticMonitorTitle: 'Skärmens namn',
        stop: 'Hållplats',
        'stop-display': 'Pysäkkinäyttö',
        stopSettings: 'Inställningar för hållplats {{stop}} ({{code}})',
        stoptitle: 'Hållplatsskärmens namn',
        tighten: 'Förtätad',
        timeShift: 'Välja bort avgångar baserat på tid',
        timeShiftDescription:
          'Du kan välja bort de avgångstider som inte är anpassade till dig.',
        timeShiftShow: 'Visa endast avgångar som avgår om minst',
        'to-own-displays': 'Siirry omiin näyttöihin',
        'two-columns': 'Två kolumner',
        userinfo: 'Mina uppgifter',
        vertical: 'Vertikal',
        viewEditorName: 'Vyns namn',
      },
    },
  },
});

export default i18n;
