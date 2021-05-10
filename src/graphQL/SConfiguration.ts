import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import SDisplay, { SDisplayInput } from "./SDisplay";
import SNode, { SNodeFields, SNodeInputFields } from './SNode';
import SPosition, { SPositionInput } from "./SPosition";

const SConfiguration = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    displays: {
      resolve: (root, {}) => root.displays,
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
    ...SNodeInputFields,
    displays: {
      type: new GraphQLList(new GraphQLNonNull(SDisplayInput)),
    },
    name: { type: GraphQLString },
    position: { type: SPositionInput },
  },
  name: 'ConfigInput',
});

export const defaultValue = {
  displays: [],
};

export default SConfiguration;
