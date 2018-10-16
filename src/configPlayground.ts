import { IConfigurations } from 'src/ui/ConfigurationList';

const configs: IConfigurations =
{
  'kamppi': {
    id: 'Foobar',
    displays: {
      'kamppinäyttö': {
        id: 'Foobar2',
        name: 'kamppinäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            id: 'Foobar3',
            displaySeconds: 5,
            view: {
              id: 'Foobar4',
              pierColumnTitle: 'FromConfig',
              stops: [
                {
                  id: 'Foobara1',
                gtfsId: 'HSL:1040271',
                },
                {
                  id: 'Foobara2',
                  gtfsId: 'HSL:1040272'
                },
                {
                  id: 'Foobara3',
                  gtfsId: 'HSL:1040273'
                },
                {
                  id: 'Foobara4',
                  gtfsId: 'HSL:1040274'
                },
                {
                  id: 'Foobara5',
                  gtfsId: 'HSL:1040275'
                },
                {
                  id: 'Foobara6',
                  gtfsId: 'HSL:1040276'
                },
                {
                  id: 'Foobara7',
                  gtfsId: 'HSL:1040277'
                },
                {
                  id: 'Foobara8',
                  gtfsId: 'HSL:1040278'
                },
                {
                  id: 'Foobara9',
                  gtfsId: 'HSL:1040279'
                },
                {
                  id: 'Foobara10',
                  gtfsId: 'HSL:1040280'
                },
                {
                  id: 'Foobara11',
                    gtfsId: 'HSL:1040281'
                },
                {
                  id: 'Foobara12',
                  gtfsId: 'HSL:1040282'
                },
              ],
              title: {
                en: '',
                fi: 'Kampin lyhyen kantaman bussilinjat',
                jp: '',
                ru: '',
                se: '',
              },
              type: 'stopTimes',
            },
          },
          {
            id: 'Foobarb',
            displaySeconds: 3,
            view: {
              id: 'Foobarb2',
              stops: [
                {
                  id: 'Foobarba1',
                  gtfsId: 'HSL:1040601',
                },
                {
                  id: 'Foobarba2',
                  gtfsId: 'HSL:1040602',
                },
              ],
              title: {
                en: '',
                fi: 'Metro kamppi',
                jp: '',
                ru: '',
                se: '',
              },
              type: 'stopTimes',
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
    id: 'Xyzzy',
    displays: {
      'eteläinenNäyttö': {
        id: 'Xyzzyz',
        name: 'eteläinenNäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            id: 'Xyzzyx',
            displaySeconds: 2,
            view: {
              id: 'Xyzza',
              pierColumnTitle: 'Pysäkki',
              stops: [
                {
                  id: 'Xyzzb1',
                  gtfsId: 'HSL:4700210',
                  overrideStopName: 'LähiPysäkki',
                },
                {
                  id: 'Xyzzb2',
                  gtfsId: 'HSL:4740217',
                  overrideStopName: 'KaukoPysäkki',
                },
              ],
              title: {
                en: '',
                fi: 'Koivukylä etelä',
                jp: '',
                ru: '',
                se: '',
              },
              type: 'stopTimes',
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
