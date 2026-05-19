import React from 'react';
import { useTranslation } from 'react-i18next';

const SkipToMainContent = () => {
  const [t] = useTranslation();
  return (
    <a className="skipLink sr-only" href="#mainContent">
      {t('skip-to-main-content')}
    </a>
  );
};
export default SkipToMainContent;
