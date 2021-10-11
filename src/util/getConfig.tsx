import { default as config } from '../monitorConfig.js';
import { IExtendedMonitorConfig } from '../App';

const defaultColors: IExtendedMonitorConfig = {
  colors: {
    alert: undefined,
    font: undefined,
    hover: undefined,
    monitorBackground: undefined,
    primary: undefined,
  },
};

const defaultModeIcons: IExtendedMonitorConfig = {
  modeIcons: {
    borderRadius: undefined,
    colors: {
      'mode-airplane': '#0046ad',
      'mode-bus': '#0088ce',
      'mode-tram': '#6a8925',
      'mode-metro': '#ed8c00',
      'mode-rail': '#af8dbc',
      'mode-ferry': '#35b5b3',
      'mode-citybike': '#f2b62d',
    },
    postfix: '',
  },
};

export const getConfig = () => {
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
  } else {
    theme = 'jyvaskyla';
  }
  return config[theme];
};

export const getPrimaryColor = () => {
  const config = getConfig();
  const colors = { ...defaultColors.colors, ...config.colors };
  return colors.primary;
};

export const getColorByName = name => {
  const config = getConfig();
  const colors = { ...defaultColors.colors, ...config.colors };
  return colors[name];
};

export const getIconStyleWithColor = mode => {
  const config = getConfig();
  const style = { ...defaultModeIcons.modeIcons, ...config.modeIcons };
  return {
    borderRadius: mode === 'subway' ? '' : style.borderRadius,
    color: style.colors[`mode-${mode}`],
    postfix: mode === 'airplane' || mode === 'subway' ? '' : style.postfix,
  };
};
