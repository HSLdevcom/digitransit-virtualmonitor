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
};

export default configs;
