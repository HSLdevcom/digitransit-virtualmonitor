import { GraphQLFloat, GraphQLInputObjectType,   GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import initialConfigurations from '../configPlayground';
import { IConfigurations2 } from "../ui/ConfigurationList";

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
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLList(Stop)
    },
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
});

const ConfigurationInputType = new GraphQLInputObjectType({
  fields: {
    name: { type: GraphQLString },
  },
  name: 'ConfigInput',
});

let currentConfigurations: IConfigurations2 = initialConfigurations;

const defaultConfiguration = {
  displays: [],
};

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: () => ({
      addConfiguration: {
        args: {
          configuration: {
            type: ConfigurationInputType,
          }
        },
        description: 'Add a new Configuration, returns the newly created Configuration',
        resolve: (_, { configuration }) => {
          const newConfiguration = { ...defaultConfiguration, ...configuration };
          currentConfigurations[configuration.name] = newConfiguration;
          return newConfiguration;
        },
        type: ConfigurationType,
      },
      deleteConfiguration: {
        args: {
          configurationId: {
            type: GraphQLString,
          }
        },
        description: 'Delete a Configuration, returns the deleted Configuration',
        resolve: (_, { configurationId }: { configurationId: string} ) => {
          const { [configurationId]: deletedConf, ...restConf } = currentConfigurations;
          currentConfigurations = restConf;
          return deletedConf;
        },
        type: ConfigurationType,
      },
      modifyConfiguration: {
        args: {
          configuration: {
            type: ConfigurationInputType,
          }
        },
        description: 'Modify a Configuration, returns the modified Configuration',
        resolve: (_, { configuration }) => {
          const newConfiguration = { ...defaultConfiguration, ...configuration };
          currentConfigurations[configuration.name] = newConfiguration;
          return newConfiguration;
        },
        type: ConfigurationType,
      },
    }),
    name: 'Mutation',
  }),
  query: new GraphQLObjectType({
    fields: {
      configurations: {
        resolve: (root, {}) => Object.values(currentConfigurations),
        type: new GraphQLList(ConfigurationType),
      },
    },
    name: 'Query',
  }),
});

export default schema;
