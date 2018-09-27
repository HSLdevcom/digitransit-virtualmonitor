import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import initialConfigurations from 'src/configPlayground';
import SConfiguration, { defaultValue as defaultConfiguration, SConfigurationInput } from "src/graphQL/SConfiguration";
import SDisplay from 'src/graphQL/SDisplay';
import SStopTimesView from 'src/graphQL/SStopTimesView';
import SView from "src/graphQL/SView";
import { IConfiguration, IDisplay, IViewBase } from 'src/ui/ConfigurationList';

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

const configurationsResolve = (_: any, { ids, name } : { ids?: ReadonlyArray<string>, name?: string }): ReadonlyArray<IConfiguration> => {
  if (ids) {
    return current.configurations.filter(c => c.id && ids.includes(c.id));
  } else if (name) {
    const foundConfiguration = current.configurations.find(c => c.name === name);
    return foundConfiguration ? [foundConfiguration] : [];
  } else  /* if (!ids && !name) Implied */ {
    return Object.values(current.configurations);
  }
}

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
        args: {
          ids: {
            defaultValue: null,
            type: new  GraphQLList(GraphQLString),
          },
          name: {
            defaultValue: null,
            type: GraphQLString,
          },
        },
        resolve: configurationsResolve,
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SConfiguration))),
      },
      displays: {
        args: {
          ids: {
            defaultValue: null,
            type: new GraphQLList(GraphQLID),
          },
        },
        resolve: (_, { ids }: { ids: ReadonlyArray<string> }) => {
          if (ids) {
            return current.displays.filter(d => d.id && ids.includes(d.id)) 
          }
          return Object.values(current.displays);
        },
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SDisplay))),
      },
      views: {
        args: {
          ids: {
            defaultValue: null,
            type: new GraphQLList(GraphQLID),
          },
        },
        resolve: (_, { ids }: { ids: ReadonlyArray<string> }) => {
          if (ids) {
            return current.views.filter(v => v.id && ids.includes(v.id)) 
          }
          return Object.values(current.views);
        },
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SView))),
      },
    },
    name: 'Query',
  }),
  types: [SStopTimesView],
});

export default schema;
