import {useEffect, useState} from "react";
import * as React from 'react';
import StopViewTitleEditor from "./StopViewTitleEditor";
import StopListContainer from './StopListContainer';
import DTAutosuggest from '@digitransit-component/digitransit-component-autosuggest';
import { gql, useLazyQuery } from '@apollo/client';
import getSearchContext from "./searchContext";
import LayoutAndTimeContainer from './LayoutAndTimeContainer'

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
interface IHelpPageProps {
  urlParamUsageText?: string,
  urlMultipleStopsText?: string,
  urlParamFindText?: string,
  urlParamFindAltText?: string,
  client: any,
}


const HelpPage :React.FC<IHelpPageProps> = (props) =>  {
  if(!props) {
    return (<p> ERROR: OHJEITA EI LÖYTYNYT</p>)
  }

  const [stops, setStops] =  useState([]);
  const [
    getStop,
    { loading, data }
  ] = useLazyQuery(GET_STOP);

  const lang = 'fi'; // en, fi or sv

  const onSelect = (selected) => {
    const properties = selected.properties;
    getStop({ variables: {stopIds: getGTFSId(properties.id)}})
  };

  const onClear = () => {
    // Called  when user clicks the clear search string button.
    return null;
  };

  useEffect(() => {
    if(data?.stopInfos) {
      setStops(stops.concat(data.stopInfos.filter(stop => stop !== null)))
    }
  }, [data]);

  const onDelete = (stop: string) => {
    setStops(stops.filter(s => s.gtfsId !== stop))
  }
  const context = getSearchContext()
  const placeholder = 'Pysäkin nimi tai numero' // TODO: -> props.t('autosuggestPlaceHolder'); When Autosuggest is in correct component
  const targets = [ 'Stops']; // Defines what you are searching. all available options are Locations, Stops, Routes, BikeRentalStations, FutureRoutes, MapPosition and CurrentPosition. Leave empty to search all targets.
  const sources = [ 'Datasource'] // Defines where you are searching. all available are: Favourite, History (previously searched searches) and Datasource. Leave empty to use all sources.
  return (
    <>
      <div>
          <StopViewTitleEditor/>
          <h1>Virtuaalimonitorin käyttöopas</h1>
          <h2>Virtuaalimonitorin käyttö selainparametrien avulla </h2>
          <p>
            {props.urlParamUsageText}
          </p>
          <p>
            {props.urlMultipleStopsText}
          </p>
          <h2> Oikean pysäkki-id:n löytäminen</h2>
          <p> {props.urlParamFindText}</p>
          <p> {props.urlParamFindAltText} </p>
      </div>
      <DTAutosuggest
          appElement={"root"} // Required. Root element's id. Needed for react-modal component.
            searchContext={context}
          icon="search"
          id="search"
          placeholder={placeholder}
          value=""
          onSelect={onSelect}
          onClear={onClear}
          autoFocus={false}
          lang={lang}
          sources={sources}
          targets={targets}
      />
      <StopListContainer stops={stops} onDelete={onDelete}/>
      <LayoutAndTimeContainer />
    </>
  )
}
export default HelpPage;
