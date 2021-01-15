import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import initialConfigurations from 'src/configPlayground';
import SConfiguration, { defaultValue as defaultConfiguration, SConfigurationInput } from "src/graphQL/SConfiguration";
import SNode from 'src/graphQL/SNode';
import SStopTimesView from 'src/graphQL/SStopTimesView';
import { IConfiguration, IDisplay, IViewBase } from 'src/ui/ConfigurationList';


export type OptionalId<T> = T & {
  id: string;
};

interface IData {
  configurations: ReadonlyArray<IConfiguration>,
  displays: ReadonlyArray<IDisplay>,
  views: ReadonlyArray<IViewBase>,
};

let current: IData = (() => {
  const configurations = initialConfigurations;
  const displays = configurations.map(c => c.displays).reduce((acc: IDisplay[], cur) => [...acc, ...cur], []);
  const views = displays.map(d => d.viewCarousel).reduce((acc, cur) => [...acc, ...cur], []).map(vc => vc.view);
  return ({
    configurations,
    displays,
    views,
  });
})();

const configurationsResolve = (_: any, { ids, name } : { ids?: ReadonlyArray<string>, name?: string }): ReadonlyArray<IConfiguration> => {
  if (ids) {
    return current.configurations.filter(c => c.id && ids.includes(c.id));
  } else if (name) {
    const foundConfiguration = current.configurations.find(c => c.name === name);
    return foundConfiguration ? [foundConfiguration] : [];
  } else  /* if (!ids && !name) Implied */ {
    return current.configurations;
  }
}

const schema = new GraphQLSchema({
  mutation: new GraphQLObjectType({
    fields: () => ({
      deleteConfiguration: {
        args: {
          configurationId: {
            type: new GraphQLNonNull(GraphQLID),
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
        description: 'Modify or create a Configuration, returns the modified/created Configuration',
        resolve: (_, { configuration }: { configuration: IConfiguration, configurationId: string }) => {
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
        resolve: (_, { configuration }: { configuration: IConfiguration, configurationId: string }) => {
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
      node: {
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
        resolve: (_, { id }: { id: string, name: string }) => {
          if (id) {
            if (current.configurations.find(c => c.id === id)) {
              return ({ ...(current.configurations.find(c => c.id === id)), __ownTypeName: 'Configuration' });
            }
            if (current.views.find(v => v.id === id)) {
              const foundView = current.views.find(v => v.id === id);
              const viewTypeMap = {
                'stopTimes': 'StopTimesView',
              };
              return ({ ...foundView, __ownTypeName: viewTypeMap[(foundView as IViewBase).type] });
            }
            if (current.displays.find(d => d.id === id)) {
              return ({ ...(current.displays.find(d => d.id === id)), __ownTypeName: 'Display' });
            }
          }
          return null;
        },
        type: SNode,
      },
    },
    name: 'Query',
  }),
  types: [SNode, SStopTimesView],
});

export default schema;
