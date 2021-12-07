export default {
  hsl: {
    fonts: {
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
        'mode-rail': '#8c4799',
        'mode-tram': '#008151',
        'mode-ferry': '#007A97',
        'mode-subway': '#CA4000',
      },
      setName: 'default',
    },
    name: 'hsl',
    uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
    showMinutes: '10',
    alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'front', // Possible values are 'front' and 'site'
    allowLogin: false,
  },
  jyvaskyla: {
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
    uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
    showMinutes: '15',
    alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'front', // Possible values are 'front' and 'site'
    allowLogin: false,
  },
  matka: {
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
    showMinutes: '15',
    alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'front', // Possible values are 'front' and 'site'
    allowLogin: false,
  },
  tampere: {
    colors: {
      primary: '#1c57cf',
      monitorBackground: '#1c57cf',
    },
    feedIds: ['tampere'],
    fonts: {
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
    monitorFont: 'Lato',
    monitorFontWeight: '700',
    name: 'tampere',
    uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
    showMinutes: '20',
    alertOrientation: 'horizontal', // Possible values are 'vertical', 'horizontal' and 'static'
    breadCrumbsStartPage: 'front', // Possible values are 'front' and 'site'
    allowLogin: false,
    useTilde: false,
  },
};
