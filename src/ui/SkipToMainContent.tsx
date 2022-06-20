import React from 'react';
import { useTranslation } from 'react-i18next';

const SkipToMainContent = () => {
  const [t] = useTranslation();
  return (
    <div className="skipLinkDiv">
      <a className="skipLink" href="#mainContent">
        {t('skip-to-main-content')}
      </a>
    </div>
  );
};
export default SkipToMainContent;
