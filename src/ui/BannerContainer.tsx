import React, { FC, useContext } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Banner from './Banner';
import BannerHSL from './BannerHSL';
import { ConfigContext } from '..';
import { useTranslation } from 'react-i18next';

const BannerContainer = props => {
  const { t } = useTranslation();
  const config = useContext(ConfigContext);
  return (
    <section className="navigation-container" aria-label="navigation">
      {config.name === 'hsl' ? <BannerHSL /> : <Banner />}
      <Breadcrumbs start={config.breadCrumbsStartPage} />
    </section>
  );
};

export default BannerContainer;
