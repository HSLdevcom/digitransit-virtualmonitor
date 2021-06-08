import React, { FC, useEffect, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { gql, useLazyQuery } from '@apollo/client';
import Icon from './Icon';
import StopViewTitleEditor from "./StopViewTitleEditor";
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import getSearchContext from "./searchContext";
import LayoutAndTimeContainer from './LayoutAndTimeContainer';
import StopListContainer from './StopListContainer';
import { SortableHandle } from 'react-sortable-hoc';

import './StopCardRow.scss';

const getGTFSId = ( id ) => {
  if (id && typeof id.indexOf === 'function' && id.indexOf('GTFS:') === 0) {
    if (id.indexOf('#') === -1) {
      return id.substring(5);
    }
    return id.substring(5, id.indexOf('#'));
  }
  return undefined;
};

const GET_STOP = gql`
  query GetStopInfos($stopIds: [String]) {
    stopInfos: stops(ids: $stopIds) {
      name
      code
      desc
      gtfsId
      platformCode
    }
  }
`;

interface IProps {
  //readonly stopCard: IViewCarouselElement,
  readonly id: number,
  readonly title: string,
  readonly stops: any,
  readonly onCardDelete?: Function,
  readonly onStopDelete?: Function,
  readonly setStops?: Function,
  readonly updateTitle?: Function,
}
const StopCardRow : FC<IProps & WithTranslation> = ({id, title, stops, onCardDelete, onStopDelete, setStops, updateTitle, t }) => {
  const lang = t('languageCode');

  const [getStop, { data }] = useLazyQuery(GET_STOP);

  const onSelect = (selected) => {
    const properties = selected.properties;
    getStop({ variables: {stopIds: getGTFSId(properties.id)}})
  };

  const onClear = () => {
    return null;
  };

  useEffect(() => {
    if(data?.stopInfos) {
      setStops(id, data.stopInfos.filter(stop => stop !== null), false);
    }
  }, [data]);
  
  const SortableHandleItem = SortableHandle(({children}) => children);

  return (
    <div className='stopcard-row-container'>
      <div className='title-with-icons'>
        <StopViewTitleEditor id={id} title={title} updateValue={updateTitle}/>
        <div className='icons'>
          <div className='delete icon' onClick={() => onCardDelete(id)}><Icon img='delete' color={'#888888'}/></div>
          <SortableHandleItem>
            <div className='drag icon'><Icon img='drag' color={'#888888'}/></div>
          </SortableHandleItem>
        </div>
      </div>
      <div className='search-stop-with-layout-and-time'>
        <div className='search-stop'>
          <DTAutosuggest
            appElement={'root'}
            searchContext={getSearchContext()}
            icon="search"
            id="search"
            placeholder={t('autosuggestPlaceHolder')}
            value=""
            onSelect={onSelect}
            onClear={onClear}
            autoFocus={false}
            lang={lang}
            sources={['Datasource']}
            targets={['Stops']}
          />
        </div>
        <LayoutAndTimeContainer />
      </div>
      <div className='stop-list'>
        <StopListContainer stops={stops} cardId={id} onStopDelete={onStopDelete} setStops={setStops}/>
      </div>
    </div>
  );
}

export default withTranslation('translations')(StopCardRow);
