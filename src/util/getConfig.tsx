import config from '../monitorConfig.js';

export const getConfig = () => {
  // When developing locally, you can define REACT_APP_CONFIG env variable. Use themes assinged below.
  const env = process.env.REACT_APP_CONFIG;
  const allowedThemes = ['hsl', 'matka', 'tampere', 'jyvaskyla', 'vaasa'];
  if (env && allowedThemes.indexOf(env) > -1) {
    return config[env];
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
  } else {
    theme = 'hsl';
  }
  return config[theme];
};
