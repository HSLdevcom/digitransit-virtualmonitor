import { default as config } from '../monitorConfig.js';

export const getConfig = () => {
  const domain = window.location.hostname;
  let monitorConfig: { feedIds?: Array<string>; uri: string };

  if (domain.indexOf('tremonitori') >= 0) {
    // domain url for Tampere Virtual monitor
    monitorConfig = config.tampere;
  } else if (domain.indexOf('matkamonitori') >= 0) {
    // domain url for Matka.fi Virtual monitor
    monitorConfig = config.matka;
  } else if (domain.indexOf('jyvaskyla') >= 0) {
    // domain url for Linkki Virtual monitor
    monitorConfig = config.linkki;
  } else {
    monitorConfig = config.matka;
  }
  return monitorConfig;
};
