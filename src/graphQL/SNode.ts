import {
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

const typeMap: { [typename: string]: GraphQLObjectType } = {
  // 'configi': SConfiguration,
};

export const SNodeFields = {
  id: {
    description: 'The unique ID of an object',
    type: new GraphQLNonNull(GraphQLID),
  },
};

export const SNodeInputFields = {
  id: {
    description: 'The unique ID of an object',
    type: GraphQLID,
  },
};

const SNode = new GraphQLInterfaceType({
  fields: SNodeFields,
  name: 'Node',
  resolveType: node => node.__ownTypeName, // The type is best resolved when at Root resolver. See schema.ts where we set __ownTypeName.
});

export default SNode;
