import { IConfigurations } from './ui/ConfigurationList';

const configs: IConfigurations =
[
  {
    displays: [
      {
        id: 'Foobar2',
        name: 'kamppinäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displaySeconds: 5,
            id: 'Foobar3',
            view: {
              id: 'Foobar4',
              pierColumnTitle: 'FromConfig',
              stops: [
                {
                  gtfsId: 'HSL:1040271',
                  id: 'Foobara1',
                },
                {
                  gtfsId: 'HSL:1040272',
                  id: 'Foobara2',
                },
                {
                  gtfsId: 'HSL:1040273',
                  id: 'Foobara3',
                },
                {
                  gtfsId: 'HSL:1040274',
                  id: 'Foobara4',
                },
                {
                  gtfsId: 'HSL:1040275',
                  id: 'Foobara5',
                },
                {
                  gtfsId: 'HSL:1040276',
                  id: 'Foobara6',
                },
                {
                  gtfsId: 'HSL:1040277',
                  id: 'Foobara7',
                },
                {
                  gtfsId: 'HSL:1040278',
                  id: 'Foobara8',
                },
                {
                  gtfsId: 'HSL:1040279',
                  id: 'Foobara9',
                },
                {
                  gtfsId: 'HSL:1040280',
                  id: 'Foobara10',
                },
                {
                  gtfsId: 'HSL:1040281',
                  id: 'Foobara11',
                },
                {
                  gtfsId: 'HSL:1040282',
                  id: 'Foobara12',
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
            displaySeconds: 3,
            id: 'Foobarb',
            view: {
              id: 'Foobarb2',
              stops: [
                {
                  gtfsId: 'HSL:1040601',
                  id: 'Foobarba1',
                },
                {
                  gtfsId: 'HSL:1040602',
                  id: 'Foobarba2',
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
    ],
    id: 'Foobar',
    name: 'kamppi',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
  {
    displays: [
      {
        id: 'Xyzzyz',
        name: 'eteläinenNäyttö',
        position: {
          lat: 7.5,
          lon: 30,
        },
        viewCarousel: [
          {
            displaySeconds: 2,
            id: 'Xyzzyx',
            view: {
              id: 'Xyzza',
              pierColumnTitle: 'Pysäkki',
              stops: [
                {
                  gtfsId: 'HSL:4700210',
                  id: 'Xyzzb1',
                  overrideStopName: 'LähiPysäkki',
                },
                {
                  gtfsId: 'HSL:4740217',
                  id: 'Xyzzb2',
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
    ],
    id: 'Xyzzy',
    name: 'Koivukylän juna-asema',
    position: {
      lat: 7.5,
      lon: 30,
    },
  },
];

export default configs;
