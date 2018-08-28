const { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } = require("graphql");

const confs =
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
}
const Position = new GraphQLObjectType({
  fields: {
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
  },
  name: 'Position',
});

const TranslatedString = new GraphQLObjectType({
  fields: {
    en: { type: GraphQLString },
    fi: { type: GraphQLString },
  },
  name: 'TranslatedString',
});

const Stop = new GraphQLObjectType({
  fields: {
    gtfsId: { type: GraphQLString },
  },
  name: 'Stop',
});

const Display = new GraphQLObjectType({
  fields: {
    position: { type: Position },
    stops: { type: new GraphQLList(Stop) },
    title: { type: TranslatedString },
  },
  name: 'Display',
});

const ConfigurationType = new GraphQLObjectType({
  fields: {
    displays: {
      resolve: (root, {}) => Object.values(root.displays),
      type: new GraphQLList(Display),
    },
    name: { type: GraphQLString },
    position: { type: Position },
  },
  name: 'Configuration',
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    fields: {
      configurations: {
        resolve: (root, {}) => Object.values(confs),
        type: new GraphQLList(ConfigurationType),
      },
    },
    name: 'Query',
  }),
});

// const TEST_QUERY2 = 'query { configurations { name } }';

module.exports = schema;

// try {
//   graphql(schema, TEST_QUERY.loc.source).then(res => { console.log(res); if (res && res.data) { console.log(res.data.configurations); } });
// } catch (ex) {
//   console.log(ex);
// }

// while (1);

// export default schema;
