import React, { FC, useState, useEffect } from "react";
import StopRow from './StopRow';
import { ReactSortable } from 'react-sortablejs';
interface Props {
  stops: any,
  onDelete: (stop: string) => void,
}

const StopListContainer : FC<Props> = (props) => {
  console.log('STOPLISTCONTAINER ', props.stops)
  const [stopList, setStopList] = useState([]);
  useEffect(() => {
    setStopList(props.stops)
  }, [props.stops])

  const stopElements =  stopList.map(stop => {
    return <StopRow stop={stop} onDelete={props.onDelete}/>
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
