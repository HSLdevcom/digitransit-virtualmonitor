import { GraphQLNonNull, GraphQLID, GraphQLInterfaceType, GraphQLObjectType, GraphQLScalarType, GraphQLString } from "graphql";
import SConfiguration from 'src/graphQL/SConfiguration';
import SStopTimesView from 'src/graphQL/SStopTimesView';

const typeMap: { [typename: string]: GraphQLObjectType } = {
  // 'configi': SConfiguration,
};

export const SNodeFields = {
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'The unique ID of an object',
  },
};

const SNode = new GraphQLInterfaceType({
  fields: SNodeFields,
  name: 'Node',
  resolveType: node => node.__ownTypeName, // The type is best resolved when at Root resolver. See schema.ts where we set __ownTypeName.
});

export default SNode;
