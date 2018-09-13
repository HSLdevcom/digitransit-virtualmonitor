import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

import initialConfigurations from 'src/configPlayground';
import { IConfiguration, IDisplay, IViewBase } from 'src/ui/ConfigurationList';
import SConfiguration, { defaultValue as defaultConfiguration, SConfigurationInput } from "src/graphQL/SConfiguration";
import SDisplay from 'src/graphQL/SDisplay';
import STimedRoutesView from 'src/graphQL/STimedRoutesView';
import SView from "src/graphQL/SView";

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface IData {
  configurations: ReadonlyArray<IConfiguration>,
  displays: ReadonlyArray<IDisplay>,
  views: ReadonlyArray<IViewBase>,
};

let current: IData = {
  configurations: Object.values(initialConfigurations),
  displays: [],
  views: [],
};

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: () => ({
      deleteConfiguration: {
        args: {
          configurationId: {
            type: new GraphQLNonNull(GraphQLString),
          }
        },
        description: 'Delete a Configuration, returns the deleted Configuration',
        resolve: (_, { configurationId }: { configurationId: string} ) => {
          // const { [configurationId]: deletedConf, ...restConf } = currentConfigurations;
          const deletedConf = current.configurations.find(conf => conf.name === configurationId);
          current = { ...current, configurations: current.configurations.filter(conf => conf !== deletedConf) };
          // currentConfigurations = restConf;
          return deletedConf;
        },
        type: SConfiguration,
      },
      modifyConfiguration: {
        args: {
          configuration: {
            type: new GraphQLNonNull(SConfigurationInput),
          }
        },
        description: 'Modify a Configuration, returns the modified Configuration',
        resolve: (_, { configuration }) => {
          const newConfiguration = { ...defaultConfiguration, ...configuration };
          current = { ...current, configurations: [...current.configurations.filter(conf => conf.name !== newConfiguration.name), newConfiguration] };
          return newConfiguration;
        },
        type: SConfiguration,
      },
      saveConfiguration: {
        args: {
          configuration: {
            type: new GraphQLNonNull(SConfigurationInput),
          }
        },
        description: 'Add a new Configuration, returns the newly created Configuration',
        resolve: (_, { configuration }) => {
          const newConfiguration = { ...defaultConfiguration, ...configuration };
          current = { ...current, configurations: [...current.configurations, newConfiguration]};
          return newConfiguration;
        },
        type: SConfiguration,
      },
    }),
    name: 'Mutation',
  }),
  query: new GraphQLObjectType({
    fields: {
      configurations: {
        resolve: (root, {}) => Object.values(current.configurations),
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SConfiguration))),
      },
      displays: {
        resolve: (root, {}) => Object.values(current.displays),
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SDisplay))),
      },
      views: {
        resolve: (root, {}) => Object.values(current.views),
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SView))),
      },
    },
    name: 'Query',
  }),
  types: [STimedRoutesView],
});

export default schema;
