import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInputObjectType } from "graphql";

import SDisplay from "src/graphQL/SDisplay";
import SPosition from "src/graphQL/SPosition";

const SConfiguration = new GraphQLObjectType({
  fields: {
    displays: {
      resolve: (root, {}) => Object.values(root.displays),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SDisplay))),
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: SPosition },
  },
  name: 'Configuration',
});

export const SConfigurationInput = new GraphQLInputObjectType({
  fields: {
    name: { type: GraphQLString },
  },
  name: 'ConfigInput',
});

export const defaultValue = {
  displays: [],
};

export default SConfiguration;
