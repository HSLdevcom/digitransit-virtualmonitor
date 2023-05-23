export default {
  hsl: {
    fonts: {
      externalFonts: [
        'https://cloud.typography.com/6364294/7432412/css/fonts.css',
      ],
      normal: '"Gotham Rounded A","Gotham Rounded B", Arial, Georgia, Serif',
      weights: {
        normal: '400',
        bigger: '500',
      },
      monitor: {
        name: '"Gotham XNarrow SSm A", "Gotham XNarrow SSm B", "Gotham Rounded A", "Gotham Rounded B", Arial, Georgia, serif',
        weight: '400',
      },
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
        'mode-bus-express': '#CA4000',
        'mode-bus-local': '#007ac9',
        'mode-rail': '#8c4799',
        'mode-tram': '#008151',
        'mode-ferry': '#007A97',
        'mode-subway': '#CA4000',
      },
      postfix: '',
      setName: 'default',
    },
    name: 'hsl',
    uri: 'routing/v2/routers/hsl/index/graphql',
    bannersUri: 'https://content.hsl.fi/api/v1/banners?',
    HSLUri:
      // eslint-disable-next-line no-undef
      window.location.href.indexOf('omatnaytot') > -1 ||
      // eslint-disable-next-line no-undef
      window.location.href.indexOf('pre-prod') > -1
        ? 'https://hsl.fi'
        : 'https://test.hslfi.hsldev.com/',
    suggestionsUri: 'https://content.hsl.fi/api/v1/search/suggestions/',
    showMinutes: '10',
    alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
    login: {
      inUse: true,
      frontPageContent: 'front-page-paragraph-hsl',
      favourites: true,
    },
    useTilde: true,
    map: {
      inUse: false,
    },
  },
  jyvaskyla: {
    fonts: {
      externalFonts: [
        'https://digitransit-prod-cdn-origin.azureedge.net/matka-fonts/roboto/roboto+montserrat.css',
      ],
    },
    colors: {
      primary: '#7DC02D',
      monitorBackground: '#0057a2',
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
    uri: 'routing/v2/routers/waltti/index/graphql',
    showMinutes: '15',
    alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
    login: {
      inUse: true,
      frontPageContent: 'front-page-paragraph-waltti',
      favourites: false,
    },
    useTilde: true,
    map: {
      inUse: false,
    },
  },
  matka: {
    name: 'matka',
    uri: 'routing/v2/routers/finland/index/graphql',
    map: {
      inUse: false,
    },
  },
  tampere: {
    colors: {
      primary: '#1c57cf',
      monitorBackground: '#1c57cf',
    },
    feedIds: ['tampere', 'TampereVR', 'tampereDRT'],
    fonts: {
      externalFonts: [
        'https://digitransit-prod-cdn-origin.azureedge.net/matka-fonts/roboto/roboto+montserrat.css',
        'https://fonts.googleapis.com/css?family=Lato',
      ],
      monitor: {
        name: 'Lato',
        weight: '700',
      },
    },
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
    uri: 'routing/v2/routers/waltti/index/graphql',
    showMinutes: '20',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    login: {
      inUse: true,
      frontPageContent: 'front-page-paragraph-waltti',
      favourites: false,
    },
    useTilde: false,
    map: {
      inUse: false,
    },
  },
  vaasa: {
    uri: 'routing/v2/routers/waltti/index/graphql',
    name: 'vaasa',
    login: {
      inUse: true,
      frontPageContent: 'front-page-paragraph-waltti',
      favourites: false,
    },
    feedIds: ['vaasa'],
    colors: {
      primary: '#000a8c',
      monitorBackground: '#000a8c',
    },
    fonts: {
      externalFonts: [
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro',
      ],
      normal: '"Source Sans Pro", Arial, Georgia, Serif',
      narrow: '"Source Sans Pro", Arial, Georgia, Serif',
      monitor: {
        name: '"Source Sans Pro", Arial, Georgia, Serif',
        weight: '700',
      },
    },
    modeIcons: {
      colors: {
        'mode-bus': '#000a8c',
      },
      postfix: '-waltti',
      setName: 'digitransit',
    },
    showMinutes: '20',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    useTilde: true,
    map: {
      inUse: false,
    },
  },
  oulu: {
    name: 'oulu',
    uri: 'routing/v2/routers/waltti/index/graphql',
    feedIds: ['OULU'],
    colors: {
      primary: '#E10669',
      monitorBackground: '#E10669',
    },
    modeIcons: {
      colors: {
        'mode-bus': '#E10669',
        'mode-bus-express': '#E10669',
        'mode-bus-local': '#E10669',
        'mode-rail': '#E10669',
        'mode-tram': '#E10669',
        'mode-ferry': '#E10669',
        'mode-subway': '#E10669',
      },
    },
    login: {
      inUse: true,
      frontPageContent: 'front-page-paragraph-waltti',
      favourites: false,
    },
    map: {
      inUse: true,
    },
  },
};
