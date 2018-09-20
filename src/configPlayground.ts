import { IConfigurations } from 'src/ui/ConfigurationList';

const configs: IConfigurations =
{
  'kamppi': {
    displays: {
      'kamppinäyttö': {
        name: 'kamppinäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displayTime: 5000,
            view: {
              stops: {
                'HSL:1040271': {
                  gtfsId: 'HSL:1040271',
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
              type: 'timedRoutes',
            },
          },
          {
            displayTime: 3000,
            view: {
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
              type: 'timedRoutes',
            },
          },
        ]
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
      'eteläinenNäyttö': {
        name: 'eteläinenNäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displayTime: 2000,
            view: {
              stops: {
                'HSL:4700210': {
                  gtfsId: 'HSL:4700210',
                  overrideStopName: 'LähiPysäkki',
                },
                'HSL:4740217': {
                  gtfsId: 'HSL:4740217',
                  overrideStopName: 'KaukoPysäkki',
                },
              },
              title: {
                en: '',
                fi: 'Koivukylä etelä',
                jp: '',
                ru: '',
                se: '',
              },
              type: 'timedRoutes',
            },
          },
        ],
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
