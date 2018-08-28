import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import confs from '../configPlayground';

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

export default schema;

// try {
//   graphql(schema, TEST_QUERY.loc.source).then(res => { console.log(res); if (res && res.data) { console.log(res.data.configurations); } });
// } catch (ex) {
//   console.log(ex);
// }

// while (1);

// export default schema;
