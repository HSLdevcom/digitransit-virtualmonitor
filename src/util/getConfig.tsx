import { default as config } from '../monitorConfig.js';

interface IMonitorConfig {
  colors?: {
    primary?: string;
    hover?: string;
  };
  alertOrientation?: string;
  feedIds?: Array<string>;
  modeIcons?: {
    borderRadius?: string;
    colors?: {
      'mode-airplane'?: string;
      'mode-bus'?: string;
      'mode-tram'?: string;
      'mode-metro'?: string;
      'mode-rail'?: string;
      'mode-ferry'?: string;
      'mode-citybike'?: string;
      'mode-citybike-secondary'?: string;
    };
    postfix?: string;
  };
  uri?: string;
}

const defaultColors: IMonitorConfig = {
  colors: {
    primary: undefined,
    hover: undefined,
  },
};

const defaultModeIcons: IMonitorConfig = {
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
export const getConfig = (requireNeeded = false) => {
  console.log('requireNeeded:', requireNeeded);
  const domain = window.location.hostname;
  let monitorConfig: IMonitorConfig;

  if (domain.indexOf('tremonitori') >= 0) {
    if (requireNeeded) {
      require('../sass/tampere/tampere.scss');
    }
    monitorConfig = config.tampere;
  } else if (domain.indexOf('matkamonitori') >= 0) {
    if (requireNeeded) {
      require('../sass/matka/matka.scss');
    }
    monitorConfig = config.matka;
  } else if (domain.indexOf('jyvaskyla') >= 0) {
    if (requireNeeded) {
      require('../sass/jyvaskyla/jyvaskyla.scss');
    }
    monitorConfig = config.linkki;
  } else if (domain.indexOf('hsl') >= 0) {
    if (requireNeeded) {
      require('../sass/hsl/hsl.scss');
    }
    monitorConfig = config.hsl;
  } else {
    if (requireNeeded) {
      require('../sass/matka/matka.scss');
    }
    monitorConfig = config.matka;

    //if (requireNeeded) {
    //  require('../sass/tampere/tampere.scss');
    //}
    //monitorConfig = config.tampere;
    
    //if (requireNeeded) {
    //  require('../sass/hsl/hsl.scss');
    //}
    //monitorConfig = config.hsl;

    //if (requireNeeded) {
    //  require('../sass/jyvaskyla/jyvaskyla.scss');
    //}
    //monitorConfig = config.linkki;
  }

  return monitorConfig;
};

export const getPrimaryColor = () => {
  const config = getConfig();
  const colors = { ...defaultColors.colors, ...config.colors };
  return colors.primary;
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
