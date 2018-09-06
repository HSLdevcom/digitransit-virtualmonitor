import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLNonNull } from "graphql";

import initialConfigurations from '../configPlayground';
import { IConfigurations2 } from "../ui/ConfigurationList";

const Position = new GraphQLObjectType({
  fields: {
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lon: { type: new GraphQLNonNull(GraphQLFloat) },
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
    gtfsId: { type: new GraphQLNonNull(GraphQLString) },
  },
  name: 'Stop',
});

const Display = new GraphQLObjectType({
  fields: {
    position: { type: Position },
    stops: {
      resolve: (root, {}) => Object.values(root.stops),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Stop)))
    },
    title: { type: new GraphQLNonNull(TranslatedString) },
  },
  name: 'Display',
});

const ConfigurationType = new GraphQLObjectType({
  fields: {
    displays: {
      resolve: (root, {}) => Object.values(root.displays),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Display))),
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
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
      saveConfiguration: {
        args: {
          configuration: {
            type: new GraphQLNonNull(ConfigurationInputType),
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
            type: new GraphQLNonNull(GraphQLString),
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
            type: new GraphQLNonNull(ConfigurationInputType),
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
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ConfigurationType))),
      },
      // displays: {
      //   resolve: (root, {}) => Object.values(currentDisplays),
      //   type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(DisplayType))),
      // },
      // view: {
      //   resolve: (root, {}) => Object.values(currentViews),
      //   type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ViewType))),
      // },
    },
    name: 'Query',
  }),
});

export default schema;
