import React, { FC, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CarouselDataContainer from './CarouselDataContainer';

const GET_TRACKS = gql`
query GetStops($stationIds: TimeTableRowWhere!) {
  trainsByDepartureDate(departureDate: "2021-09-21", where: {and: [ {trainType: {trainCategory: {name: {equals: "Commuter"}}}},{timetableType: {unequals: "ADHOC"}}]}) {
    commuterLineid
    trainNumber
    timetableType
    runningCurrently
    timeTableRows(where: $stationIds)  {
      commercialStop
      type
      scheduledTime
      trainStopping
      actualTime
      commercialTrack
      station {
        name
      }
    }
  }
}`;

const dataMap = [{
  name: "Keravan asema",
  gtfsId: "HSL:9000202",
  shortCode: "KE",
}]

const getStationIds = monitor => {
  const ids = [];
  monitor.cards.forEach(card => {
    console.log(card);
    Object.keys(card.columns).forEach(column => {
      card.columns[column].stops?.forEach(stop => {
        if (stop.mode === "RAIL") {
          ids.push(stop.parentStation ? stop.parentStation.gtfsId : stop.gtfsId)
        }
      })
    }) 
  })
  return ids;
}

interface IProps {
  monitor: any;
}
const TrainDataFetcher : FC<IProps> = ({monitor}) => {
  

  const stationIds = getStationIds(monitor);
  const shortCodes = stationIds.map(id => dataMap.find(i => i.gtfsId === id).shortCode)
  console.log("ids",shortCodes);
  const queryObject = shortCodes.map(code => {
    return {station: {shortCode: {equals: code}}}
  })

  const { data, loading } = useQuery(GET_TRACKS, {variables: { stationIds: {and: [{type: {equals: "DEPARTURE"}}, {or: queryObject}]} }, context: { clientName: 'rail-data-client' } });
  useEffect(() => {
    console.log(data)
  }, [data])

  return <CarouselDataContainer
  views={monitor.cards}
  languages={monitor.languages}
/>
}

export default TrainDataFetcher;