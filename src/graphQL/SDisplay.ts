import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLFloat } from "graphql";

import SPosition from "./SPosition";
import SStop from "src/graphQL/SStop";
import STranslatedString from "src/graphQL/STranslatedString";
import SView from 'src/graphQL/SView';

const SViewWithDisplayTime = new GraphQLObjectType({
  fields: {
    view: { type: SView },
    displayTime: { type: GraphQLFloat },
  },
  name: 'ViewWithDisplayTime',
});

const SDisplay = new GraphQLObjectType({
  fields: {
    viewCarousel: {
      type: new GraphQLNonNull(new GraphQLList(SViewWithDisplayTime)),
    },
    position: { type: SPosition },
    title: { type: new GraphQLNonNull(STranslatedString) },
  },
  name: 'Display',
});

export const defaultValue = {
  views: [],
};

export default SDisplay;
