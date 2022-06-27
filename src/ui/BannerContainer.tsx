import React, { FC, useContext } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Banner from './Banner';
import BannerHSL from './BannerHSL';
import { ConfigContext } from '..';

const BannerContainer = () => {
  const config = useContext(ConfigContext);
  return (
    <section aria-label="navigation">
      {config.name === 'hsl' ? <BannerHSL /> : <Banner />}
      <Breadcrumbs start={config.breadCrumbsStartPage} />
    </section>
  );
};

export default BannerContainer;
