export default {
  hsl: {
    fonts: {
      normal: '"Gotham Rounded A","Gotham Rounded B", Arial, Georgia, Serif', 
      narrow: '"Gotham XNarrow SSm A", "Gotham XNarrow SSm B", "Gotham Rounded A", "Gotham Rounded B", Arial, Georgia, serif',
    },
    colors: {
      primary: '#007ac9',
      hover: '#0062a1',
      monitorBackground: '#0057a2',
    },
    feedIds: ['HSL'],
    modeIcons: {
      colors: {
        'mode-bus': '#007ac9',
        'mode-rail': '#8c4799',
        'mode-tram': '#008151',
        'mode-ferry': '#007A97',
        'mode-subway': '#CA4000',
      },
      setName: 'default',
    },
    name: 'hsl',
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    urlMultipleStopsText:
      'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi /stop/HSL:1040279,HSL:1230109/10. Voit määrittää usean pysäkin näytölle otsikon url-parametrilla title, esimerkiksi /stop/HSL:1040279,HSL:1230109/10?title=Omat pysäkit',
    urlParamFindAltText:
      'Esimerkiksi reittiopas.hsl.fi/pysakit/HSL%3A123010 nähdään, että pysäkki-id on HSL:123010. Huomaathan että %3A on HTML koodia, ja se tarkoittaa : merkkiä.',
    urlParamFindText:
      'Löydät oikean pysäkki-id:n helposti esimerkiksi reittioppaasta: Siirry halutun pysäkin pysäkkinäkymään, ja katso urlin lopusta pysäkki-id. ',
    urlParamUsageText:
      'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/HSL:1230109/10 Näyttää 10 riviä pysäkiltä Kumpulan kampus',
    showMinutes: '10',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'site', // Possible values are 'front' and 'site'
  },
  jyvaskyla: {
    fonts: {
      normal: '"Gotham Rounded A","Gotham Rounded B", Arial, Georgia, Serif', 
      narrow: '"Gotham XNarrow SSm A", "Gotham XNarrow SSm B", "Gotham Rounded A", "Gotham Rounded B", Arial, Georgia, serif',
    },
    colors: {
      primary: '#7DC02D',
    },
    feedIds: ['LINKKI'],
    modeIcons: {
      colors: {
        'mode-bus': '#7DC02D',
      },
      postfix: '-waltti',
      setName: 'digitransit',
    },
    name: 'jyvaskyla',
    uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
    urlMultipleStopsText:
      'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi /stop/LINKKI:207477,LINKKI:207818,LINKKI:207478/10. Voit määrittää usean pysäkin näytölle otsikon url-parametrilla title, esimerkiksi /stop/LINKKI:207477,LINKKI:207818,LINKKI:207478/10?title=Omat pysäkit',
    urlParamFindAltText: '',
    urlParamFindText:
      'Löydät oikean pysäkki-id:n helposti esimerkiksi jyvaskyla.digitransit.fi osoitteesta. Siirry pysäkin pysäkkinäkymään, ja katso urlin lopusta pysäkki-id.',
    urlParamUsageText:
      'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/LINKKI:207477/10 näyttää 10 riviä pysäkiltä Urhonkatu 1.',
    showMinutes: '10',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'site', // Possible values are 'front' and 'site'
  },
  matka: {
    fonts: {
      normal: '"Gotham Rounded A","Gotham Rounded B", Arial, Georgia, Serif', 
      narrow: '"Gotham XNarrow SSm A", "Gotham XNarrow SSm B", "Gotham Rounded A", "Gotham Rounded B", Arial, Georgia, serif',
    },
    colors: {
      primary: '#026273',
      monitorBackground: '#0057a2',
    },
    feedIds: ['MATKA', 'HSL', 'tampere', 'LINKKI', 'lautta', 'OULU'],
    modeIcons: {
      colors: {
        'mode-airplane': '#0046AD',
        'mode-bus': '#007ac9',
        'mode-tram': '#5E7921',
        'mode-subway': '#CA4000',
        'mode-rail': '#8E5EA0',
        'mode-ferry': '#247C7B',
      },
      postfix: '-waltti',
      setName: 'digitransit',
    },
    name: 'matka',
    uri: 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
    urlMultipleStopsText:
      'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi /stop/MATKA:7_201860,MATKA:7_201848/10. Voit määrittää usean pysäkin näytölle otsikon url-parametrilla title, esimerkiksi /stop/MATKA:7_201860,MATKA:7_201848/10?title=Omat pysäkit',
    urlParamFindAltText:
      'Esimerkiksi https://opas.matka.fi/pysakit/MATKA%3A7_201848 nähdään, että pysäkki-id on MATKA:7_201848. Huomaathan että %3A on HTML koodia, ja se tarkoittaa : merkkiä.',
    urlParamFindText:
      'Löydät oikean pysäkki-id:n helposti esimerkiksi reittioppaasta: Siirry halutun Waltti-kaupungin pysäkin pysäkkinäkymään, ja katso urlin lopusta pysäkki-id. ',
    urlParamUsageText:
      'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/MATKA:7_201860/10 Näyttää 10 riviä pysäkiltä Umpikuja E',
    showMinutes: '15',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'front', // Possible values are 'front' and 'site'
  },
  tampere: {
    fonts: {
      normal: '"Gotham Rounded A","Gotham Rounded B", Arial, Georgia, Serif', 
      narrow: '"Gotham XNarrow SSm A", "Gotham XNarrow SSm B", "Gotham Rounded A", "Gotham Rounded B", Arial, Georgia, serif',
    },
    colors: {
      primary: '#1c57cf',
    },
    feedIds: ['tampere'],
    modeIcons: {
      colors: {
        'mode-bus': '#1A4A8F',
        'mode-rail': '#0E7F3C',
        'mode-tram': '#DA2128',
        'mode-hybrid-bus-tram': '#1A4A8F,#DA2128',
      },
      postfix: '-waltti',
      setName: 'digitransit',
    },
    name: 'tampere',
    uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
    urlMultipleStopsText:
      'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi /stop/tampere:0010,tampere:3729,tampere:3730/10. Voit määrittää usean pysäkin näytölle otsikon url-parametrilla title, esimerkiksi /stop/tampere:0010,tampere:3729,tampere:3730/10?title=Omat pysäkit',
    urlParamFindAltText: '',
    urlParamFindText:
      'Pysäkki-id on sama kuin pysäkin numero. Esimerkiksi Keskusterori F:n pysäkiltä saat kirjoittamalla tampere:0010. Pysäkkinumerot löytyvät esimerkiksi Reittioppaasta.',
    urlParamUsageText:
      'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/tampere:0010/10 näyttää 10 riviä pysäkiltä Keskustori F.',
    showMinutes: '20',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'site', // Possible values are 'front' and 'site'
  },
};
