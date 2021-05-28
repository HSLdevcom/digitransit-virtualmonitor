import React, { FC, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import StopCode from './StopCode';
import Icon from './Icon';
import { IStopInfo } from './StopInfoRetriever'
import './StopRow.scss';

interface IProps {
  readonly stop: IStopInfo,
  readonly onDelete: Function,
}
const StopRow : FC<IProps & WithTranslation> = ({stop, onDelete, t}) => {
  const [hiddenRoutes, setHiddenRoutes] = useState([]);
  return (
    <div className='stop-row-container'>
      <div className='stop-row-stop icon'><Icon img='stop' /></div>
      <div className='stop-row-main'>
        <div className='stop-upper-row'>
          {stop.name}
          <div className='hidden-routes'>{t('hiddenRoutes')}</div>
        </div>
        <div className='stop-bottom-row'>
          {stop.desc && (<div className='address'>{stop.desc}</div>)}
          <StopCode code={stop.code}/>
          <div className='hidden-choices'>
            {!hiddenRoutes.length && (
              t('hiddenNoChoices')
            )}
          </div>
        </div>
      </div>
      <div className='stop-row-delete icon' onClick={() => onDelete(stop.gtfsId)}><Icon img='delete' /></div>
      <div className='stop-row-drag icon'><Icon img='drag' /></div>
    </div>
  );
}

export default withTranslation('translations')(StopRow);
