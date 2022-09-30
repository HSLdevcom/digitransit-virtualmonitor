import React, { useContext } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Banner from './Banner';
import BannerHSL from './BannerHSL';
import { ConfigContext } from '../contexts';

const BannerContainer = () => {
  const config = useContext(ConfigContext);
  return (
    <section className="navigation-container" aria-label="navigation">
      {config.name === 'hsl' ? <BannerHSL /> : <Banner />}
      <Breadcrumbs />
    </section>
  );
};

export default BannerContainer;
