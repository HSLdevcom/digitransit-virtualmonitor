import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import SDisplay from "src/graphQL/SDisplay";
import SPosition from "src/graphQL/SPosition";
import SNode, { SNodeFields } from 'src/graphQL/SNode';

const SConfiguration = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    displays: {
      resolve: (root, {}) => Object.values(root.displays),
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SDisplay))),
    },
    name: { type: new GraphQLNonNull(GraphQLString) },
    position: { type: SPosition },
  },
  interfaces: () => [SNode],
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
