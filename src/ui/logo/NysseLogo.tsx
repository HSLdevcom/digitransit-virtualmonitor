import * as React from 'react';

export default ({ style }: { style?: React.CSSProperties } = { style: {} }) => (
  <svg
    id={'logo'}
    viewBox={'0 0 60 60'}
    version={'1.1'}
    preserveAspectRatio={'xMinYMid meet'}
    style={{ color: 'gray', ...style }}
  >
    <path
      fill={'#ffffff'}
      d={
        'M45.3933333,42.1033333 L45.3933333,42.1566667 C45.370578,43.7396955 44.2115531,45.0765096 42.6477343,45.3234284 C41.0839155,45.5703471 39.5693924,44.6556721 39.06,43.1566667 C37.98,39.8833333 34.0866667,36.1133333 28.3933333,32.8233333 C25.8009216,31.3419687 23.3612834,29.6079833 21.11,27.6466667 L21.11,42.14 C21.1479947,43.3265357 20.5366746,44.4395678 19.5149698,45.0440757 C18.493265,45.6485836 17.2234017,45.6485836 16.2016969,45.0440757 C15.1799921,44.4395678 14.568672,43.3265357 14.6066667,42.14 L14.6066667,17.8766667 C14.6071959,16.2850386 15.7592106,14.92747 17.3295388,14.6679526 C18.8998671,14.4084352 20.4274101,15.3231716 20.94,16.83 C22.04,20.12 25.94,23.8933333 31.6233333,27.1833333 C34.2090554,28.6474776 36.6422209,30.3659914 38.8866667,32.3133333 L38.8866667,17.86 C38.848672,16.6734643 39.4599921,15.5604322 40.4816969,14.9559243 C41.5034017,14.3514164 42.773265,14.3514164 43.7949698,14.9559243 C44.8166746,15.5604322 45.4279947,16.6734643 45.39,17.86 L45.39,42.1033333 L45.3933333,42.1033333 Z'
      }
    />
  </svg>
);
