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
      'mode-subway': '#ed8c00',
      'mode-rail': '#af8dbc',
      'mode-ferry': '#35b5b3',
      'mode-citybike': '#f2b62d',
    },
    postfix: '',
    setName: '',
  },
};

const defaultFonts: IExtendedMonitorConfig = {
  fonts: {
    normal: '"Roboto", arial, georgia, serif',
    monitor: {
      name: '"Roboto Condensed", "Arial Condensed", arial, georgia, serif',
      weights: {
        normal: '500',
        bigger: '700',
      },
    },
  },
};

export const getConfig = () => {
  // When developing locally, you can define REACT_APP_CONFIG env variable. Use themes assinged below.
  const env = process.env.REACT_APP_CONFIG;
  const allowedThemes = ['hsl', 'matka', 'tampere', 'jyvaskyla'];
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
  } else {
    theme = 'matka';
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

export const getIconStyleWithColor = modeIn => {
  let mode = modeIn;
  if (modeIn && modeIn.indexOf('-') !== -1) {
    mode = modeIn.substring(modeIn.indexOf('-') + 1);
  }
  const config = getConfig();
  const style = { ...defaultModeIcons.modeIcons, ...config.modeIcons };
  return {
    borderRadius: mode === 'subway' ? '' : style.borderRadius,
    color: style.colors[`mode-${mode}`],
    postfix: mode === 'airplane' || mode === 'subway' ? '' : style.postfix,
  };
};

export const getAllIconStyleWithColor = () => {
  const config = getConfig();
  const style = { ...defaultModeIcons.modeIcons, ...config.modeIcons };
  return style.colors;
};

export const getModeSet = () => {
  const config = getConfig();
  const style = { ...defaultModeIcons.modeIcons, ...config.modeIcons };
  return style.setName;
};

export const getFontByName = name => {
  const config = getConfig();
  const fonts = { ...defaultFonts.fonts, ...config.fonts };
  return fonts[name];
};

export const useTilde = () => {
  const config = getConfig();
  if (config.useTilde !== undefined) {
    return config.useTilde;
  }
  return true;
};
