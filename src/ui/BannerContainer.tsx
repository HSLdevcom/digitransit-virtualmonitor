import React, { FC } from 'react';
import Breadcrumbs from './Breadcrumbs';
import Banner from './Banner';
import BannerHSL from './BannerHSL';

interface Props {
  login: boolean;
  config: any;
}

const BannerContainer: FC<Props> = ({ config, login }) => {
  return (
    <section aria-label="navigation">
      {config.name === 'hsl' ? (
        <BannerHSL config={config} user={{}} favourites={[]} />
      ) : (
        <Banner config={config} user={{}} />
      )}
      <Breadcrumbs isLogged={login} start={config.breadCrumbsStartPage} />
    </section>
  );
};

export default BannerContainer;
