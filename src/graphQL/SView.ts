import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import SStopTimesView from './SStopTimesView';
import STranslatedString from './STranslatedString';

const typeMap: { [typename: string]: GraphQLObjectType } = {
  stopTimes: SStopTimesView,
};

export const SViewFields = {
  title: { type: new GraphQLNonNull(STranslatedString) },
  type: {
    type: new GraphQLNonNull(GraphQLString),
  },
};

const SView = new GraphQLInterfaceType({
  fields: SViewFields,
  name: 'View',
  resolveType: view => typeMap[view.type],
});

export default SView;
