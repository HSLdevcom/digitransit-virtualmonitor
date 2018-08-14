import { IConfiguration, IDisplay } from 'src/ui/Config';

interface IConfigurations {
  [configurationName: string]: IConfiguration,
};

const def: IDisplay = {
  position: {
    lat: 7.5,
    lon: 30,
  },
  stops: {
    'a': {
      gtfsId: 'a',
    },
  },
  title: {
    en: '',
    fi: '',
    jp: '',
    ru: '',
    se: '',
  }
};

const configs: IConfigurations =
{
  'kamppi': {
    displays: {
      'bussilinjat': {
        position: {
          lat: 7.5,
          lon: 30,
        },
        stops: {
          'HSL:1040271': {
            gtfsId: 'HSL:1040271'
          },
          'HSL:1040272': {
              gtfsId: 'HSL:1040272'
          },
          'HSL:1040273': {
              gtfsId: 'HSL:1040273'
          },
          'HSL:1040274': {
              gtfsId: 'HSL:1040274'
          },
          'HSL:1040275': {
              gtfsId: 'HSL:1040275'
          },
          'HSL:1040276': {
              gtfsId: 'HSL:1040276'
          },
          'HSL:1040277': {
              gtfsId: 'HSL:1040277'
          },
          'HSL:1040278': {
              gtfsId: 'HSL:1040278'
          },
          'HSL:1040279': {
              gtfsId: 'HSL:1040279'
          },
          'HSL:1040280': {
              gtfsId: 'HSL:1040280'
          },
          'HSL:1040281': {
              gtfsId: 'HSL:1040281'
          },
          'HSL:1040282': {
              gtfsId: 'HSL:1040282'
          },
        },
        title: {
          en: '',
          fi: 'Kampin lyhyen kantaman bussilinjat',
          jp: '',
          ru: '',
          se: '',
        },
      },
      'default': def,
      'metro-sisäänkäynti': {
        position: {
          lat: 7.5,
          lon: 30,
        },
        stops: {
          'HSL:1040601': {
            gtfsId: 'HSL:1040601',
          },
          'HSL:1040602': {
            gtfsId: 'HSL:1040602',
          },
        },
        title: {
          en: '',
          fi: 'Metro kamppi',
          jp: '',
          ru: '',
          se: '',
        },
      },
    },
    name: 'kamppi',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
  'koivukylä': {
    displays: {
      'etelä': {
        position: {
          lat: 7.5,
          lon: 30,
        },
        stops: {
          'HSL:4700210': {
            gtfsId: 'HSL:4700210',
          },
          'HSL:4740217': {
            gtfsId: 'HSL:4740217',
          },
        },
        title: {
          en: '',
          fi: 'Koivukylä etelä',
          jp: '',
          ru: '',
          se: '',
        },
      },
    },
    name: 'Koivukylän juna-asema',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
};

export default configs;
