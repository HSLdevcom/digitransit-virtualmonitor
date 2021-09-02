import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import cx from 'classnames';

interface IProps {
  show: boolean;
  isPreview: boolean;
}
const MonitorOverlay : FC<IProps> = ({isPreview, show}) => {
  return (<>{!isPreview && (
    <div className={cx("monitor-overlay", show ? 'show' : 'hide')}><Link className="link" to={`/createview${window.location.search}`}>
      <Icon img="arrow-down" height={60} width={60}/>
      </Link></div>
  )}</>)
  
}

export default MonitorOverlay;
