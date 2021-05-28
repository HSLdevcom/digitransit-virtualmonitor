import React, { FC, useState } from "react";
import StopRow from './StopRow';
import { ReactSortable } from 'react-sortablejs';

const stops = [
  {
    id: "U3RvcDpIU0w6MTAyMDEzMQ==",
    name: "Elielinaukio",
    code: "H2022",
    desc: "Elielinaukio",
    gtfsId: "HSL:1020131",
    platformCode: "22"
  },
  {
    id: "U3RvcDpIU0w6OTY3MDUyNQ==",
    name: "Maraton",
    code: "Tu6743",
    desc: null,
    gtfsId: "HSL:9670525",
    platformCode: null
  },
  {
    id: "U3RvcDpIU0w6OTY3MDUyNg==",
    name: "Mätäkivi",
    code: "Tu6741",
    desc: "Vanha Tuusulantie",
    gtfsId: "HSL:9670526",
    platformCode: null
  },
  {
    id: "U3RvcDpIU0w6MTAyMDEzMw==",
    name: "Elielinaukio",
    code: "H2023",
    desc: "Elielinaukio",
    gtfsId: "HSL:1020133",
    platformCode: "23"
  },
];

const StopListContainer : FC = (props) => {
  const [stopList, setStopList] = useState(stops);

  const onDelete = (stop: string) => {
    setStopList(stopList.filter(s => s.gtfsId !== stop))
  }
  const stopElements =  stopList.map(stop => {
    return <StopRow stop={stop} onDelete={onDelete}/>
  })
  return (
    <ReactSortable 
      list={stopList} 
      setList={setStopList}
      handle={'.stop-row-drag'}
      animation={200}
    >
      {stopElements}
    </ReactSortable>
  );
}

export default StopListContainer;
