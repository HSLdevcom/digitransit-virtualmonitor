import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import SNode, { SNodeFields, SNodeInputFields } from './SNode';
import SPosition, { SPositionInput } from './SPosition';
// import STranslatedString from "src/graphQL/STranslatedString";
import SView from './SView';

const SViewWithDisplaySeconds = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    displaySeconds: {
      description: 'How many seconds the view is displayed on carousel.',
      type: new GraphQLNonNull(GraphQLInt),
    },
    view: { type: new GraphQLNonNull(SView) },
  },
  interfaces: () => [SNode],
  name: 'ViewWithDisplaySeconds',
});

const SViewWithDisplaySecondsInput = new GraphQLInputObjectType({
  fields: {
    ...SNodeFields,
    displaySeconds: {
      description: 'How many seconds the view is displayed on carousel.',
      type: GraphQLInt,
    },
    view: { type: GraphQLID },
  },
  name: 'ViewWithDisplaySecondsInput',
});

const SDisplay = new GraphQLObjectType({
  fields: {
    ...SNodeFields,
    name: { type: GraphQLString },
    position: { type: SPosition },
    viewCarousel: {
      type: new GraphQLNonNull(new GraphQLList(SViewWithDisplaySeconds)),
    },
  },
  interfaces: () => [SNode],
  name: 'Display',
});

export const SDisplayInput = new GraphQLInputObjectType({
  fields: {
    ...SNodeInputFields,
    name: { type: GraphQLString },
    position: { type: SPositionInput },
    viewCarousel: {
      type: new GraphQLList(SViewWithDisplaySecondsInput),
    },
  },
  name: 'DisplayInput',
});

export const defaultValue = {
  views: [],
};

export default SDisplay;
