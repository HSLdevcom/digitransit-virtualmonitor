import React, { FC } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

interface IProps {
  white?: boolean;
  isPreview?: boolean;
}
const NoMonitorsFound: FC<IProps & WithTranslation> = props => (
  <div className="not-found">
    <span> {props.t('noMonitors')} </span>
    <a href={'/createview'}>
      <button className={'to-create-view'}>
        {props.t('quickDisplayCreate')}
      </button>
    </a>
  </div>
);

export default withTranslation('translations')(NoMonitorsFound);
