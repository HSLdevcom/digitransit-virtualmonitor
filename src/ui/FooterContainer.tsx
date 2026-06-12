import React, { useContext } from 'react';
import { ConfigContext } from '../contexts';
import FooterHSL from './FooterHSL';

const FooterContainer = () => {
  const config = useContext(ConfigContext);

  if (config.name !== 'hsl') {
    return null;
  }

  return <FooterHSL />;
};

export default FooterContainer;
