import * as React from "react";
import StopCode from './StopCode';
import './StopRow.scss';

const StopRow = ({stop}) => {
  return (
    <div className='stop-row-container'>
      <div className='stop-row-icon'></div>
      <div className='stop-row-main'>
        <div className='stop-upper-row'>{stop.name}</div>
        <div className='stop-bottom-row'>
          {stop.desc && (<div className='address'>{stop.desc}</div>)}
          <StopCode code={stop.code}/>
        </div>
      </div>
      <div className='stop-row-delete'></div>
      <div className='stop-row-drag'></div>
    </div>
  );
}

export default StopRow;


