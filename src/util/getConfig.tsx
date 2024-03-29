import config from '../monitorConfig.js';
import defaultConfig from '../defaultConfig.js';
import { mergeWith } from 'lodash';

export const getConfig = () => {
  const merger = (destination, source) => {
    // don't merge arrays
    if (Array.isArray(source)) {
      return source;
    }
  };
  // When developing locally, you can define REACT_APP_CONFIG env variable. Use themes assinged below.
  const env = process.env.REACT_APP_CONFIG;
  const allowedThemes = [
    'hsl',
    'matka',
    'tampere',
    'jyvaskyla',
    'vaasa',
    'oulu',
  ];
  if (env && allowedThemes.indexOf(env) > -1) {
    return mergeWith(defaultConfig, config[env], merger);
  }
  const domain = window.location.hostname;
  let theme;

  if (domain.indexOf('tremonitori') >= 0) {
    theme = 'tampere';
  } else if (domain.indexOf('matkamonitori') >= 0) {
    theme = 'matka';
  } else if (domain.indexOf('jyvaskyla') >= 0) {
    theme = 'jyvaskyla';
  } else if (domain.indexOf('hsl') >= 0) {
    theme = 'hsl';
  } else if (domain.indexOf('vaasa') >= 0) {
    theme = 'vaasa';
  } else if (domain.indexOf('oulu') >= 0) {
    theme = 'oulu';
  } else if (domain.indexOf('osl') >= 0) {
    theme = 'oulu';
  } else {
    theme = 'hsl';
  }
  return mergeWith(defaultConfig, config[theme], merger);
};

export const getDomainIdentifierForTheme = {
  hsl: 'hsl',
  matka: 'matka',
  tampere: 'tre',
  jyvaskyla: 'jyvaskyla',
  vaasa: 'vaasa',
  oulu: 'oulu',
};
