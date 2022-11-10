export default {
  colors: {
    primary: '#026273',
    monitorBackground: '#0057a2',
    alert: '#dc0451',
  },
  feedIds: [
    'MATKA',
    'HSL',
    'tampere',
    'LINKKI',
    'lautta',
    'OULU',
    'digitraffic',
  ],
  fonts: {
    weights: {
      normal: '400',
      bigger: '500',
    },
    monitor: {
      name: '"Roboto Condensed", "Arial Condensed", arial, georgia, serif',
      weight: '400',
    },
    normal: '"Roboto", arial, georgia, serif',
    narrow: '"Roboto Condensed", "Arial Condensed", arial, georgia, serif',
    externalFonts: [
      'https://digitransit-prod-cdn-origin.azureedge.net/matka-fonts/roboto/roboto+montserrat.css',
    ],
  },
  modeIcons: {
    colors: {
      'mode-airplane': '#0046AD',
      'mode-bus': '#007ac9',
      'mode-bus-express': '#007ac9',
      'mode-bus-local': '#007ac9',
      'mode-tram': '#5E7921',
      'mode-subway': '#CA4000',
      'mode-rail': '#8E5EA0',
      'mode-ferry': '#247C7B',
    },
    postfix: '-waltti',
    setName: 'digitransit',
  },
  name: 'default',
  uri: 'routing/v1/routers/finland/index/graphql',
  showMinutes: '15',
  alertOrientation: 'static', // Possible values are 'vertical', 'horizontal' and 'static'
  allowLogin: false,
  useTilde: true,
};
