import React, { FC } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';


const SkipToMainContent: FC<WithTranslation> = ({ t }) => {
  return (
    <div className="skipLinkDiv">
      <a className="skipLink" href="#mainContent">
        {t('skip-to-main-content')}
      </a>
    </div>
  );
};
export default withTranslation('translations')(SkipToMainContent);