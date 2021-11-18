import * as React from 'react';

export default ({ style, forMonitor }: { style?: React.CSSProperties, forMonitor: boolean } = { style: {}, forMonitor: false }) => {
  if(!forMonitor) {
    return (
      <svg
        id={'logo'}
        viewBox={'0 0 160 60'}
        version={'1.1'}
        preserveAspectRatio={'xMinYMid meet'}
        style={{ color: 'gray', ...style }}
      >
        <path
          fill={'#ffffff'}
          d={
            'M157.723,28.249 L145.934,28.249 C144.534,28.249 143.427,27.137 143.427,25.728 L143.427,7.669 C143.427,6.263 144.534,5.149 145.934,5.149 C147.335,5.149 148.441,6.263 148.441,7.669 L148.441,23.67 L157.723,23.67 C158.994,23.67 160.003,24.682 160.003,25.959 C160.003,27.234 158.994,28.249 157.723,28.249 Z M160.002,33.131 C160.002,33.785 159.448,34.308 158.795,34.308 L152.186,34.308 L152.186,53.679 C152.186,54.398 151.601,54.988 150.885,54.988 C150.166,54.988 149.581,54.398 149.581,53.679 L149.581,34.308 L142.972,34.308 C142.318,34.308 141.768,33.785 141.768,33.131 C141.768,32.476 142.318,31.921 142.972,31.921 L158.795,31.921 C159.448,31.921 160.002,32.476 160.002,33.131 Z M140.764,53.711 C140.764,54.398 140.113,54.988 139.463,54.988 C138.941,54.988 138.55,54.691 138.256,54.298 L131.842,45.926 L125.297,45.926 L125.297,53.679 C125.297,54.398 124.71,54.988 123.995,54.988 C123.309,54.988 122.723,54.398 122.723,53.679 L122.723,33.228 C122.723,32.509 123.309,31.921 123.995,31.921 L132.525,31.921 C135.325,31.921 137.572,32.772 139.005,34.211 C140.113,35.324 140.764,36.926 140.764,38.725 L140.764,38.791 C140.764,42.554 138.224,44.747 134.674,45.433 L140.34,52.762 C140.601,53.058 140.764,53.352 140.764,53.711 Z M138.156,38.89 L138.156,38.823 C138.156,36.011 136.008,34.308 132.33,34.308 L125.297,34.308 L125.297,43.601 L132.297,43.601 C135.716,43.601 138.156,41.834 138.156,38.89 Z M132.069,28.577 C129.075,28.577 126.045,27.66 123.506,25.829 C122.952,25.438 122.561,24.718 122.561,23.931 C122.561,22.621 123.603,21.607 124.906,21.607 C125.558,21.607 126.012,21.835 126.338,22.065 C128.062,23.342 129.952,24.126 132.168,24.126 C134.219,24.126 135.454,23.309 135.454,21.968 L135.454,21.902 C135.454,20.626 134.674,19.971 130.863,18.99 C126.271,17.811 123.309,16.537 123.309,11.988 L123.309,11.924 C123.309,7.767 126.631,5.02 131.287,5.02 C134.055,5.02 136.466,5.739 138.516,7.048 C139.07,7.374 139.624,8.062 139.624,9.044 C139.624,10.352 138.58,11.368 137.279,11.368 C136.791,11.368 136.398,11.234 136.008,11.006 C134.347,10.024 132.785,9.469 131.222,9.469 C129.301,9.469 128.292,10.352 128.292,11.465 L128.292,11.53 C128.292,13.035 129.269,13.526 133.209,14.54 C137.832,15.751 140.438,17.419 140.438,21.41 L140.438,21.476 C140.438,26.027 136.986,28.577 132.069,28.577 Z M117.051,28.446 C115.653,28.446 114.545,27.334 114.545,25.926 L114.545,19.055 L105.297,19.055 L105.297,25.926 C105.297,27.334 104.19,28.446 102.789,28.446 C101.39,28.446 100.283,27.334 100.283,25.926 L100.283,7.669 C100.283,6.263 101.39,5.149 102.789,5.149 C104.19,5.149 105.297,6.263 105.297,7.669 L105.297,14.409 L114.545,14.409 L114.545,7.669 C114.545,6.263 115.653,5.149 117.051,5.149 C118.454,5.149 119.56,6.263 119.56,7.669 L119.56,25.926 C119.56,27.334 118.454,28.446 117.051,28.446 Z M79.702,60.006 C79.018,60.006 78.433,59.419 78.433,58.697 L78.433,1.307 C78.433,0.588 79.018,0 79.702,0 C80.418,0 81.005,0.588 81.005,1.307 L81.005,58.697 C81.005,59.419 80.418,60.006 79.702,60.006 Z M74.557,60.006 C73.873,60.006 73.286,59.419 73.286,58.697 L73.286,1.307 C73.286,0.588 73.873,0 74.557,0 C75.274,0 75.859,0.588 75.859,1.307 L75.859,58.697 C75.859,59.419 75.274,60.006 74.557,60.006 Z M54.01,34.642 C53.872,34.642 51.338,34.626 49.432,32.791 L45.563,42.083 C48.173,42.177 49.959,43.935 50.055,44.029 C52.393,46.38 52.751,49.434 50.901,51.291 C49.052,53.15 46.013,52.793 43.674,50.443 C43.574,50.345 41.792,48.534 41.737,45.881 L32.459,49.706 C34.239,51.626 34.267,54.134 34.267,54.273 C34.267,57.596 32.367,60.006 29.753,60.006 C27.138,60.006 25.241,57.596 25.241,54.273 C25.241,54.134 25.256,51.588 27.083,49.674 L17.842,45.791 C17.742,48.404 16.001,50.194 15.903,50.29 C13.565,52.64 10.525,52.998 8.674,51.14 C6.828,49.285 7.181,46.236 9.513,43.887 C9.609,43.79 11.417,41.995 14.065,41.944 L10.254,32.613 C8.34,34.402 5.845,34.432 5.707,34.432 C2.401,34.432 0,32.525 0,29.899 C0,27.27 2.401,25.364 5.707,25.364 C5.847,25.364 8.379,25.38 10.286,27.215 L14.156,17.921 C11.544,17.828 9.76,16.073 9.663,15.974 C7.324,13.626 6.966,10.572 8.817,8.714 C10.666,6.857 13.706,7.214 16.044,9.564 C16.143,9.661 17.925,11.474 17.981,14.124 L27.259,10.302 C25.481,8.38 25.451,5.871 25.451,5.735 C25.451,2.412 27.349,0 29.966,0 C32.579,0 34.476,2.412 34.476,5.735 C34.476,5.873 34.461,8.417 32.633,10.333 L41.878,14.215 C41.975,11.601 43.719,9.813 43.814,9.716 C46.153,7.365 49.193,7.008 51.042,8.867 C52.89,10.722 52.537,13.769 50.206,16.118 C50.108,16.217 48.3,18.013 45.654,18.063 L49.464,27.39 C51.376,25.604 53.874,25.574 54.01,25.574 C57.317,25.574 59.718,27.481 59.718,30.108 C59.718,32.736 57.317,34.642 54.01,34.642 Z M5.713,27.972 C3.91,27.972 2.595,28.78 2.595,29.899 C2.595,31.013 3.903,31.822 5.703,31.824 C5.828,31.819 8.003,31.754 9.113,29.916 C8.027,28.017 5.814,27.972 5.713,27.972 Z M45.506,48.594 C46.781,49.877 48.278,50.235 49.064,49.448 C49.85,48.66 49.495,47.159 48.223,45.878 C48.131,45.789 46.547,44.292 44.469,44.803 C43.901,46.919 45.434,48.522 45.506,48.594 Z M29.753,57.397 C30.865,57.397 31.669,56.085 31.67,54.278 C31.669,54.15 31.603,51.965 29.771,50.85 C27.883,51.942 27.836,54.164 27.836,54.266 C27.836,56.078 28.645,57.397 29.753,57.397 Z M11.354,45.725 C10.078,47.004 9.726,48.507 10.511,49.296 C11.296,50.084 12.788,49.727 14.065,48.451 C14.151,48.357 15.636,46.773 15.136,44.69 C13.027,44.111 11.427,45.654 11.354,45.725 Z M14.213,11.412 C12.939,10.131 11.44,9.772 10.652,10.559 C9.869,11.346 10.222,12.847 11.494,14.126 C11.586,14.216 13.172,15.712 15.25,15.203 C15.817,13.088 14.285,11.483 14.213,11.412 Z M29.966,2.607 C28.853,2.607 28.05,3.919 28.047,5.73 C28.05,5.857 28.115,8.041 29.946,9.154 C31.835,8.062 31.88,5.842 31.881,5.74 C31.881,3.928 31.074,2.607 29.966,2.607 Z M48.364,14.28 C49.639,13.001 49.993,11.499 49.207,10.711 C48.422,9.923 46.927,10.278 45.654,11.556 C45.566,11.647 44.08,13.234 44.581,15.315 C46.691,15.895 48.292,14.352 48.364,14.28 Z M42.546,17.324 L29.925,12.021 L17.252,17.244 L11.967,29.938 L17.172,42.681 L29.793,47.984 L42.466,42.762 L47.751,30.068 L42.546,17.324 Z M54.015,28.182 C53.89,28.184 51.713,28.251 50.604,30.091 C51.69,31.987 53.905,32.034 54.005,32.036 C55.808,32.036 57.122,31.225 57.122,30.108 C57.122,28.996 55.816,28.184 54.015,28.182 Z M102.041,31.757 C102.757,31.757 103.343,32.346 103.343,33.065 L103.343,42.095 L116.498,42.095 L116.498,33.065 C116.498,32.346 117.084,31.757 117.8,31.757 C118.484,31.757 119.07,32.346 119.07,33.065 L119.07,53.678 C119.07,54.398 118.484,54.988 117.8,54.988 C117.084,54.988 116.498,54.398 116.498,53.678 L116.498,44.518 L103.343,44.518 L103.343,53.678 C103.343,54.398 102.757,54.988 102.041,54.988 C101.358,54.988 100.771,54.398 100.771,53.678 L100.771,33.065 C100.771,32.346 101.358,31.757 102.041,31.757 Z'
          }
        />
      </svg>
    );
  }
  return (
    <svg width="340" height="170" viewBox="0 0 340 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M167.595 57.208C167.595 56.1846 166.756 55.345 165.737 55.345C164.756 55.345 163.921 56.1846 163.921 57.208V138.8C163.921 139.826 164.756 140.658 165.737 140.658C166.756 140.658 167.595 139.826 167.595 138.8V57.208ZM136.407 100.741L136.393 100.741C136.105 100.728 133.073 100.591 131.53 98.006C133.104 95.3653 136.227 95.2728 136.407 95.268C138.971 95.2728 140.836 96.4247 140.836 98.006C140.836 99.5857 138.971 100.732 136.407 100.741ZM129.427 125.545C128.31 126.67 126.178 126.157 124.358 124.349L124.348 124.338C124.152 124.123 122.115 121.887 122.842 118.967C125.801 118.221 128.071 120.333 128.225 120.477L128.227 120.479C130.04 122.297 130.545 124.425 129.427 125.545ZM101.881 136.951C100.301 136.951 99.1535 135.092 99.1497 132.529C99.1535 132.344 99.2529 129.226 101.881 127.642C104.517 129.226 104.616 132.344 104.62 132.529C104.616 135.092 103.469 136.951 101.881 136.951ZM79.4095 124.349C77.589 126.157 75.461 126.67 74.3409 125.545C73.225 124.425 73.7249 122.297 75.54 120.479L75.5469 120.473C75.7373 120.298 77.987 118.227 80.9274 118.967C81.675 121.946 79.5353 124.218 79.4095 124.349ZM67.363 100.741C64.7981 100.732 62.9314 99.5857 62.9314 98.006C62.9314 96.4247 64.7981 95.2728 67.363 95.268C67.5431 95.2728 70.6649 95.3653 72.2446 98.006C70.6957 100.591 67.6643 100.728 67.3769 100.741L67.363 100.741ZM74.3409 70.4602C75.4567 69.3352 77.589 69.848 79.4073 71.6594C79.5353 71.7873 81.675 74.0684 80.9274 77.0467C77.9646 77.7889 75.703 75.6803 75.543 75.531L75.54 75.5283C73.7249 73.7132 73.2207 71.5803 74.3409 70.4602ZM101.881 59.0507C103.469 59.0507 104.616 60.9147 104.62 63.4818C104.616 63.6646 104.517 66.7842 101.881 68.3634C99.2529 66.7842 99.1535 63.6646 99.1497 63.4818C99.1535 60.9147 100.301 59.0507 101.881 59.0507ZM124.358 71.6594C126.178 69.848 128.31 69.3352 129.427 70.4602C130.545 71.5803 130.04 73.7132 128.227 75.5283C128.097 75.6519 125.818 77.7938 122.842 77.0467C122.1 74.0684 124.236 71.7873 124.358 71.6594ZM119.96 116.079L101.881 123.566L83.8073 116.079L76.3162 98.006V98.0012L83.8073 79.9309L101.881 72.4441L119.96 79.9309L127.451 98.0012V98.006L119.96 116.079ZM136.395 91.5657C136.202 91.5657 132.607 91.6108 129.874 94.1795L124.376 80.9113C128.128 80.799 130.702 78.2889 130.84 78.154C134.175 74.8156 134.684 70.4779 132.047 67.8393C129.407 65.2051 125.076 65.7087 121.74 69.0471C121.6 69.1869 119.087 71.7604 118.975 75.5084L105.707 70.0125C108.278 67.2744 108.316 63.6845 108.316 63.4883C108.316 58.7712 105.615 55.3452 101.881 55.3452C98.1575 55.3452 95.449 58.7712 95.449 63.4883C95.449 63.6845 95.4893 67.2744 98.065 70.0125L84.7931 75.5084C84.6802 71.7604 82.1695 69.1869 82.0298 69.0471C78.6914 65.7087 74.3548 65.2051 71.7249 67.8393C69.0857 70.4779 69.5921 74.8156 72.9256 78.154L72.9337 78.1617C73.1452 78.364 75.6928 80.8007 79.3891 80.9113L73.8931 94.1795C71.1642 91.6108 67.5657 91.5657 67.37 91.5657C62.6545 91.5657 59.2285 94.2741 59.2285 98.006C59.2285 101.736 62.6545 104.44 67.37 104.44C67.5657 104.44 71.1642 104.4 73.8931 101.826L79.3891 115.094C75.6362 115.207 73.0675 117.717 72.9278 117.861C69.5921 121.191 69.0857 125.527 71.7249 128.168C74.3548 130.8 78.6914 130.296 82.0298 126.958C82.1695 126.823 84.6802 124.246 84.7931 120.502L98.065 125.995C95.4893 128.731 95.449 132.321 95.449 132.515C95.449 137.239 98.1548 140.658 101.881 140.658C105.615 140.658 108.316 137.239 108.316 132.515C108.316 132.321 108.278 128.731 105.707 125.995L118.975 120.502C119.087 124.246 121.6 126.823 121.74 126.958C125.073 130.296 129.407 130.8 132.047 128.168C134.684 125.527 134.175 121.191 130.84 117.861C130.702 117.717 128.128 115.207 124.376 115.094L129.874 101.826C132.607 104.4 136.202 104.44 136.395 104.44C141.118 104.44 144.539 101.736 144.539 98.006C144.539 94.2741 141.118 91.5657 136.395 91.5657ZM203.156 102.361C203.156 101.336 203.997 100.494 204.974 100.494C206 100.494 206.832 101.336 206.832 102.361V115.197H225.625V102.361C225.625 101.336 226.462 100.494 227.488 100.494C228.46 100.494 229.297 101.336 229.297 102.361V131.665C229.297 132.69 228.46 133.523 227.488 133.523C226.462 133.523 225.625 132.69 225.625 131.665V118.635H206.832V131.665C206.832 132.69 206 133.523 204.974 133.523C203.997 133.523 203.156 132.69 203.156 131.665V102.361ZM256.565 110.63C256.565 114.824 253.079 117.335 248.193 117.335H238.192V104.125H248.237C253.497 104.125 256.565 106.546 256.565 110.545V110.63ZM236.333 100.732C235.357 100.732 234.52 101.565 234.52 102.59V131.664C234.52 132.69 235.357 133.522 236.333 133.522C237.359 133.522 238.192 132.69 238.192 131.664V120.637H247.545L256.71 132.546C257.128 133.104 257.686 133.522 258.428 133.522C259.355 133.522 260.296 132.69 260.296 131.714C260.296 131.201 260.057 130.778 259.684 130.359L251.589 119.944C256.66 118.967 260.296 115.845 260.296 110.495V110.41C260.296 107.85 259.355 105.569 257.776 103.981C255.729 101.938 252.526 100.732 248.521 100.732H236.333ZM272.888 104.125H263.445C262.513 104.125 261.722 103.383 261.722 102.452C261.722 101.52 262.513 100.732 263.445 100.732H286.049C286.98 100.732 287.771 101.52 287.771 102.452C287.771 103.383 286.98 104.125 286.049 104.125H276.609V131.664C276.609 132.69 275.772 133.522 274.747 133.522C273.725 133.522 272.888 132.69 272.888 131.664V104.125ZM206.045 62.6675C204.042 62.6675 202.459 64.251 202.459 66.251V92.2042C202.459 94.2064 204.042 95.7904 206.045 95.7904C208.046 95.7904 209.626 94.2064 209.626 92.2042V82.4389H222.835V92.2042C222.835 94.2064 224.419 95.7904 226.417 95.7904C228.415 95.7904 229.998 94.2064 229.998 92.2042V66.251C229.998 64.251 228.415 62.6675 226.417 62.6675C224.419 62.6675 222.835 64.251 222.835 66.251V75.8341H209.626V66.251C209.626 64.251 208.046 62.6675 206.045 62.6675ZM235.631 92.0647C234.843 91.5116 234.286 90.4877 234.286 89.3697C234.286 87.5029 235.775 86.063 237.637 86.063C238.565 86.063 239.217 86.3935 239.68 86.7203C242.146 88.5333 244.841 89.6443 248.008 89.6443C250.937 89.6443 252.706 88.4839 252.706 86.5763V86.4908C252.706 84.6681 251.585 83.7393 246.15 82.3467C239.585 80.6686 235.357 78.8556 235.357 72.39V72.296C235.357 66.3905 240.099 62.4834 246.749 62.4834C250.708 62.4834 254.149 63.5041 257.078 65.3649C257.87 65.8304 258.662 66.8113 258.662 68.2056C258.662 70.0637 257.169 71.5085 255.31 71.5085C254.613 71.5085 254.055 71.3236 253.497 70.9931C251.126 69.5983 248.89 68.8135 246.663 68.8135C243.919 68.8135 242.474 70.0637 242.474 71.6483V71.7381C242.474 73.8794 243.869 74.5771 249.497 76.0208C256.102 77.7398 259.823 80.1064 259.823 85.7861V85.8807C259.823 92.3442 254.887 95.9745 247.869 95.9745C243.594 95.9745 239.267 94.6742 235.631 92.0647ZM267.674 62.6675C265.672 62.6675 264.097 64.251 264.097 66.251V91.9258C264.097 93.9296 265.672 95.5115 267.674 95.5115H284.514C286.332 95.5115 287.772 94.0693 287.772 92.2537C287.772 90.4407 286.332 88.9943 284.514 88.9943H271.255V66.251C271.255 64.251 269.676 62.6675 267.674 62.6675ZM173.086 55.345C174.11 55.345 174.946 56.1846 174.946 57.208V138.8C174.946 139.826 174.11 140.658 173.086 140.658C172.107 140.658 171.275 139.826 171.275 138.8V57.208C171.275 56.1846 172.107 55.345 173.086 55.345Z" fill="white"/>
      <path d="M44.612 40.423C46.397 40.423 47.405 39.583 48.35 37.315L52.403 27.592C52.445 27.466 52.508 27.193 52.508 26.983C52.508 26.311 51.962 25.786 51.29 25.786C50.639 25.786 50.282 26.227 50.072 26.752L47.3 34.123L44.318 26.752C44.087 26.164 43.73 25.786 43.079 25.786C42.365 25.786 41.819 26.311 41.819 27.025C41.819 27.193 41.882 27.445 41.966 27.634L46.082 36.832L45.998 37.063C45.578 37.924 45.179 38.239 44.423 38.239C44.066 38.239 43.835 38.176 43.541 38.092C43.415 38.05 43.289 38.008 43.079 38.008C42.533 38.008 42.05 38.428 42.05 39.058C42.05 39.667 42.47 39.982 42.848 40.108C43.373 40.318 43.898 40.423 44.612 40.423ZM54.5012 35.845C54.5012 36.559 55.0682 37.105 55.7612 37.105C56.4752 37.105 57.0422 36.559 57.0422 35.845V30.742C57.0422 29.02 58.0712 27.991 59.5412 27.991C61.0532 27.991 61.9142 28.978 61.9142 30.7V35.845C61.9142 36.559 62.4812 37.105 63.1952 37.105C63.9092 37.105 64.4552 36.559 64.4552 35.845V29.923C64.4552 27.361 63.0062 25.681 60.5072 25.681C58.7852 25.681 57.7562 26.584 57.0422 27.613V22.825C57.0422 22.132 56.4752 21.565 55.7612 21.565C55.0472 21.565 54.5012 22.132 54.5012 22.825V35.845ZM70.8207 37.189C71.4927 37.189 72.0177 37.084 72.5637 36.895C72.9207 36.748 73.2357 36.37 73.2357 35.908C73.2357 35.32 72.7317 34.858 72.1647 34.858C72.0807 34.858 71.8287 34.921 71.5347 34.921C70.6737 34.921 70.1697 34.522 70.1697 33.535V28.096H72.1647C72.7737 28.096 73.2777 27.613 73.2777 27.004C73.2777 26.395 72.7737 25.912 72.1647 25.912H70.1697V24.022C70.1697 23.329 69.6027 22.762 68.9097 22.762C68.1957 22.762 67.6287 23.329 67.6287 24.022V25.912H67.2087C66.5997 25.912 66.1167 26.395 66.1167 27.004C66.1167 27.613 66.5997 28.096 67.2087 28.096H67.6287V33.934C67.6287 36.37 68.9517 37.189 70.8207 37.189ZM76.9208 30.679C77.1518 28.957 78.2438 27.76 79.7978 27.76C81.4778 27.76 82.4438 29.041 82.6118 30.679H76.9208ZM84.0818 35.782C84.2708 35.593 84.4178 35.32 84.4178 35.005C84.4178 34.417 83.9768 33.976 83.4098 33.976C83.1158 33.976 82.9478 34.06 82.7588 34.207C82.0448 34.795 81.2048 35.173 80.1338 35.173C78.4958 35.173 77.2148 34.165 76.9418 32.359H83.8928C84.5438 32.359 85.0898 31.855 85.0898 31.141C85.0898 28.579 83.3468 25.681 79.8188 25.681C76.6478 25.681 74.4008 28.285 74.4008 31.456V31.498C74.4008 34.921 76.8788 37.252 80.0918 37.252C81.8138 37.252 83.0738 36.685 84.0818 35.782ZM87.2217 23.056C87.2217 23.812 87.8517 24.316 88.6707 24.316C89.4897 24.316 90.1197 23.812 90.1197 23.056V22.93C90.1197 22.174 89.4897 21.691 88.6707 21.691C87.8517 21.691 87.2217 22.174 87.2217 22.93V23.056ZM87.4107 35.845C87.4107 36.559 87.9777 37.105 88.6707 37.105C89.3847 37.105 89.9517 36.559 89.9517 35.845V27.067C89.9517 26.353 89.3847 25.786 88.6707 25.786C87.9567 25.786 87.4107 26.353 87.4107 27.067V35.845ZM96.6534 37.21C98.9634 37.21 100.769 36.055 100.769 33.724V33.682C100.769 31.687 98.9424 30.952 97.3254 30.448C96.0234 30.028 94.8264 29.692 94.8264 28.873V28.831C94.8264 28.201 95.3934 27.739 96.3804 27.739C97.1574 27.739 98.0814 28.033 98.9844 28.495C99.1524 28.579 99.2784 28.621 99.4884 28.621C100.076 28.621 100.538 28.18 100.538 27.592C100.538 27.151 100.286 26.815 99.9294 26.626C98.8584 26.059 97.6194 25.723 96.4434 25.723C94.2384 25.723 92.4954 27.004 92.4954 29.104V29.146C92.4954 31.267 94.3224 31.939 95.9604 32.401C97.2624 32.8 98.4384 33.094 98.4384 33.955V33.997C98.4384 34.732 97.8084 35.194 96.7164 35.194C95.7084 35.194 94.5954 34.837 93.5244 34.123C93.3774 34.039 93.1884 33.976 92.9784 33.976C92.3904 33.976 91.9494 34.438 91.9494 35.005C91.9494 35.425 92.1594 35.74 92.4324 35.887C93.7134 36.769 95.2464 37.21 96.6534 37.21ZM106.465 37.189C107.137 37.189 107.662 37.084 108.208 36.895C108.565 36.748 108.88 36.37 108.88 35.908C108.88 35.32 108.376 34.858 107.809 34.858C107.725 34.858 107.473 34.921 107.179 34.921C106.318 34.921 105.814 34.522 105.814 33.535V28.096H107.809C108.418 28.096 108.922 27.613 108.922 27.004C108.922 26.395 108.418 25.912 107.809 25.912H105.814V24.022C105.814 23.329 105.247 22.762 104.554 22.762C103.84 22.762 103.273 23.329 103.273 24.022V25.912H102.853C102.244 25.912 101.761 26.395 101.761 27.004C101.761 27.613 102.244 28.096 102.853 28.096H103.273V33.934C103.273 36.37 104.596 37.189 106.465 37.189ZM112.978 40.423C114.763 40.423 115.771 39.583 116.716 37.315L120.769 27.592C120.811 27.466 120.874 27.193 120.874 26.983C120.874 26.311 120.328 25.786 119.656 25.786C119.005 25.786 118.648 26.227 118.438 26.752L115.666 34.123L112.684 26.752C112.453 26.164 112.096 25.786 111.445 25.786C110.731 25.786 110.185 26.311 110.185 27.025C110.185 27.193 110.248 27.445 110.332 27.634L114.448 36.832L114.364 37.063C113.944 37.924 113.545 38.239 112.789 38.239C112.432 38.239 112.201 38.176 111.907 38.092C111.781 38.05 111.655 38.008 111.445 38.008C110.899 38.008 110.416 38.428 110.416 39.058C110.416 39.667 110.836 39.982 111.214 40.108C111.739 40.318 112.264 40.423 112.978 40.423ZM129.849 21.88C129.072 21.88 128.463 22.426 128.463 23.182V23.329C128.463 24.085 129.072 24.61 129.849 24.61C130.605 24.61 131.214 24.085 131.214 23.329V23.182C131.214 22.426 130.605 21.88 129.849 21.88ZM125.67 21.88C124.893 21.88 124.284 22.426 124.284 23.182V23.329C124.284 24.085 124.893 24.61 125.67 24.61C126.426 24.61 127.035 24.085 127.035 23.329V23.182C127.035 22.426 126.426 21.88 125.67 21.88ZM127.728 37.252C131.151 37.252 133.671 34.627 133.671 31.477V31.435C133.671 28.264 131.172 25.681 127.77 25.681C124.368 25.681 121.848 28.306 121.848 31.477V31.519C121.848 34.669 124.347 37.252 127.728 37.252ZM127.77 35.026C125.796 35.026 124.389 33.409 124.389 31.477V31.435C124.389 29.503 125.691 27.907 127.728 27.907C129.723 27.907 131.13 29.524 131.13 31.477V31.519C131.13 33.43 129.828 35.026 127.77 35.026ZM139.639 37.21C141.949 37.21 143.755 36.055 143.755 33.724V33.682C143.755 31.687 141.928 30.952 140.311 30.448C139.009 30.028 137.812 29.692 137.812 28.873V28.831C137.812 28.201 138.379 27.739 139.366 27.739C140.143 27.739 141.067 28.033 141.97 28.495C142.138 28.579 142.264 28.621 142.474 28.621C143.062 28.621 143.524 28.18 143.524 27.592C143.524 27.151 143.272 26.815 142.915 26.626C141.844 26.059 140.605 25.723 139.429 25.723C137.224 25.723 135.481 27.004 135.481 29.104V29.146C135.481 31.267 137.308 31.939 138.946 32.401C140.248 32.8 141.424 33.094 141.424 33.955V33.997C141.424 34.732 140.794 35.194 139.702 35.194C138.694 35.194 137.581 34.837 136.51 34.123C136.363 34.039 136.174 33.976 135.964 33.976C135.376 33.976 134.935 34.438 134.935 35.005C134.935 35.425 135.145 35.74 135.418 35.887C136.699 36.769 138.232 37.21 139.639 37.21ZM149.535 37.21C151.845 37.21 153.651 36.055 153.651 33.724V33.682C153.651 31.687 151.824 30.952 150.207 30.448C148.905 30.028 147.708 29.692 147.708 28.873V28.831C147.708 28.201 148.275 27.739 149.262 27.739C150.039 27.739 150.963 28.033 151.866 28.495C152.034 28.579 152.16 28.621 152.37 28.621C152.958 28.621 153.42 28.18 153.42 27.592C153.42 27.151 153.168 26.815 152.811 26.626C151.74 26.059 150.501 25.723 149.325 25.723C147.12 25.723 145.377 27.004 145.377 29.104V29.146C145.377 31.267 147.204 31.939 148.842 32.401C150.144 32.8 151.32 33.094 151.32 33.955V33.997C151.32 34.732 150.69 35.194 149.598 35.194C148.59 35.194 147.477 34.837 146.406 34.123C146.259 34.039 146.07 33.976 145.86 33.976C145.272 33.976 144.831 34.438 144.831 35.005C144.831 35.425 145.041 35.74 145.314 35.887C146.595 36.769 148.128 37.21 149.535 37.21ZM159.026 37.231C160.727 37.231 161.882 36.517 162.638 35.614V36.034C162.638 36.601 163.142 37.105 163.877 37.105C164.57 37.105 165.116 36.58 165.116 35.887V30.427C165.116 28.978 164.738 27.802 163.919 27.004C163.142 26.206 161.903 25.765 160.244 25.765C158.795 25.765 157.724 26.017 156.674 26.416C156.296 26.563 155.981 26.962 155.981 27.424C155.981 28.012 156.464 28.474 157.052 28.474C157.178 28.474 157.304 28.453 157.451 28.411C158.144 28.138 158.942 27.97 159.908 27.97C161.693 27.97 162.659 28.81 162.659 30.385V30.658C161.798 30.385 160.916 30.196 159.677 30.196C156.968 30.196 155.099 31.372 155.099 33.766V33.808C155.099 36.034 156.947 37.231 159.026 37.231ZM159.74 35.383C158.522 35.383 157.577 34.774 157.577 33.703V33.661C157.577 32.506 158.543 31.813 160.181 31.813C161.189 31.813 162.05 32.002 162.701 32.254V33.01C162.701 34.417 161.42 35.383 159.74 35.383ZM162.512 21.88C161.735 21.88 161.126 22.426 161.126 23.182V23.329C161.126 24.085 161.735 24.61 162.512 24.61C163.268 24.61 163.877 24.085 163.877 23.329V23.182C163.877 22.426 163.268 21.88 162.512 21.88ZM158.333 21.88C157.556 21.88 156.947 22.426 156.947 23.182V23.329C156.947 24.085 157.556 24.61 158.333 24.61C159.089 24.61 159.698 24.085 159.698 23.329V23.182C159.698 22.426 159.089 21.88 158.333 21.88ZM171.935 39.142C171.935 39.499 172.229 39.793 172.607 39.793C172.88 39.793 173.09 39.625 173.216 39.373L182.372 21.145C182.414 21.061 182.456 20.914 182.456 20.788C182.456 20.431 182.162 20.137 181.805 20.137C181.511 20.137 181.301 20.305 181.175 20.557L172.04 38.785C171.977 38.869 171.935 39.016 171.935 39.142ZM190.365 36.265C190.365 36.727 190.743 37.105 191.184 37.105C191.646 37.105 192.024 36.727 192.024 36.265V23.035C192.024 22.573 191.646 22.195 191.184 22.195C190.743 22.195 190.365 22.573 190.365 23.035V36.265ZM205.104 37.21C207.267 37.21 208.968 36.013 208.968 33.955V33.913C208.968 31.96 207.162 31.309 205.482 30.805C204.033 30.364 202.689 29.965 202.689 28.936V28.894C202.689 27.991 203.508 27.319 204.789 27.319C205.713 27.319 206.7 27.634 207.624 28.159C207.708 28.201 207.834 28.243 207.981 28.243C208.38 28.243 208.695 27.928 208.695 27.55C208.695 27.235 208.506 27.004 208.296 26.878C207.246 26.311 205.986 25.954 204.831 25.954C202.689 25.954 201.135 27.193 201.135 29.062V29.104C201.135 31.099 203.025 31.687 204.726 32.17C206.154 32.569 207.435 32.989 207.435 34.081V34.123C207.435 35.173 206.49 35.845 205.188 35.845C204.012 35.845 202.857 35.446 201.744 34.69C201.639 34.606 201.492 34.564 201.345 34.564C200.946 34.564 200.631 34.879 200.631 35.257C200.631 35.53 200.778 35.74 200.925 35.845C202.101 36.685 203.676 37.21 205.104 37.21ZM214.786 37.231C216.697 37.231 217.957 36.349 218.713 35.362V36.349C218.713 36.769 219.028 37.105 219.49 37.105C219.931 37.105 220.267 36.769 220.267 36.307V30.364C220.267 28.978 219.889 27.928 219.154 27.193C218.356 26.395 217.18 25.996 215.647 25.996C214.261 25.996 213.169 26.269 212.098 26.731C211.888 26.815 211.657 27.067 211.657 27.403C211.657 27.781 211.993 28.096 212.371 28.096C212.455 28.096 212.56 28.075 212.665 28.033C213.463 27.676 214.387 27.424 215.479 27.424C217.516 27.424 218.713 28.432 218.713 30.385V30.763C217.747 30.49 216.76 30.301 215.374 30.301C212.623 30.301 210.733 31.519 210.733 33.808V33.85C210.733 36.076 212.77 37.231 214.786 37.231ZM215.101 35.95C213.631 35.95 212.371 35.152 212.371 33.787V33.745C212.371 32.38 213.505 31.498 215.542 31.498C216.865 31.498 217.936 31.729 218.734 31.96V33.01C218.734 34.732 217.096 35.95 215.101 35.95ZM223.293 36.286C223.293 36.748 223.65 37.105 224.112 37.105C224.574 37.105 224.91 36.748 224.91 36.286V30.805C224.91 28.81 226.212 27.382 227.934 27.382C229.656 27.382 230.727 28.579 230.727 30.616V36.286C230.727 36.748 231.084 37.105 231.525 37.105C231.987 37.105 232.344 36.748 232.344 36.286V30.742C232.344 28.6 233.688 27.382 235.326 27.382C237.09 27.382 238.14 28.558 238.14 30.658V36.286C238.14 36.748 238.497 37.105 238.959 37.105C239.4 37.105 239.757 36.748 239.757 36.286V30.28C239.757 27.592 238.224 25.912 235.725 25.912C233.835 25.912 232.68 26.878 231.903 28.075C231.315 26.857 230.181 25.912 228.417 25.912C226.59 25.912 225.624 26.899 224.91 27.97V26.857C224.91 26.395 224.553 26.038 224.091 26.038C223.65 26.038 223.293 26.416 223.293 26.857V36.286ZM246.081 37.231C247.992 37.231 249.252 36.349 250.008 35.362V36.349C250.008 36.769 250.323 37.105 250.785 37.105C251.226 37.105 251.562 36.769 251.562 36.307V30.364C251.562 28.978 251.184 27.928 250.449 27.193C249.651 26.395 248.475 25.996 246.942 25.996C245.556 25.996 244.464 26.269 243.393 26.731C243.183 26.815 242.952 27.067 242.952 27.403C242.952 27.781 243.288 28.096 243.666 28.096C243.75 28.096 243.855 28.075 243.96 28.033C244.758 27.676 245.682 27.424 246.774 27.424C248.811 27.424 250.008 28.432 250.008 30.385V30.763C249.042 30.49 248.055 30.301 246.669 30.301C243.918 30.301 242.028 31.519 242.028 33.808V33.85C242.028 36.076 244.065 37.231 246.081 37.231ZM246.396 35.95C244.926 35.95 243.666 35.152 243.666 33.787V33.745C243.666 32.38 244.8 31.498 246.837 31.498C248.16 31.498 249.231 31.729 250.029 31.96V33.01C250.029 34.732 248.391 35.95 246.396 35.95ZM254.589 36.286C254.589 36.748 254.946 37.105 255.408 37.105C255.87 37.105 256.206 36.727 256.206 36.286V32.59C256.206 29.461 257.928 27.886 260.028 27.634C260.448 27.571 260.742 27.256 260.742 26.815C260.742 26.353 260.427 25.996 259.944 25.996C258.579 25.996 257.004 27.088 256.206 28.894V26.857C256.206 26.395 255.849 26.038 255.387 26.038C254.946 26.038 254.589 26.416 254.589 26.857V36.286ZM262.679 36.286C262.679 36.727 263.036 37.105 263.498 37.105C263.96 37.105 264.296 36.727 264.296 36.286V34.921C265.136 36.139 266.438 37.231 268.454 37.231C271.079 37.231 273.641 35.131 273.641 31.582V31.54C273.641 27.97 271.058 25.912 268.454 25.912C266.459 25.912 265.178 27.025 264.296 28.327V22.384C264.296 21.922 263.939 21.565 263.477 21.565C263.036 21.565 262.679 21.922 262.679 22.384V36.286ZM268.16 35.782C266.144 35.782 264.233 34.102 264.233 31.582V31.54C264.233 29.062 266.144 27.361 268.16 27.361C270.218 27.361 271.982 28.999 271.982 31.561V31.603C271.982 34.228 270.26 35.782 268.16 35.782ZM277.171 30.973C277.381 28.852 278.809 27.277 280.699 27.277C282.862 27.277 283.996 28.999 284.164 30.973H277.171ZM285.046 35.614C285.214 35.467 285.298 35.278 285.298 35.089C285.298 34.711 284.983 34.396 284.584 34.396C284.395 34.396 284.248 34.48 284.122 34.585C283.324 35.32 282.337 35.845 280.993 35.845C279.061 35.845 277.402 34.522 277.171 32.17H285.025C285.424 32.17 285.781 31.855 285.781 31.414C285.781 28.537 283.954 25.912 280.741 25.912C277.738 25.912 275.533 28.432 275.533 31.561V31.603C275.533 34.963 277.969 37.252 280.951 37.252C282.799 37.252 284.017 36.601 285.046 35.614ZM291.845 37.189C292.475 37.189 292.979 37.084 293.441 36.895C293.714 36.79 293.903 36.559 293.903 36.265C293.903 35.887 293.588 35.572 293.21 35.572C293.084 35.572 292.79 35.719 292.223 35.719C291.131 35.719 290.396 35.236 290.396 33.913V27.571H293.21C293.609 27.571 293.945 27.256 293.945 26.857C293.945 26.479 293.609 26.143 293.21 26.143H290.396V23.581C290.396 23.14 290.018 22.762 289.577 22.762C289.115 22.762 288.779 23.14 288.779 23.581V26.143H287.897C287.519 26.143 287.183 26.458 287.183 26.857C287.183 27.235 287.519 27.571 287.897 27.571H288.779V34.123C288.779 36.328 290.102 37.189 291.845 37.189ZM296.941 30.973C297.151 28.852 298.579 27.277 300.469 27.277C302.632 27.277 303.766 28.999 303.934 30.973H296.941ZM304.816 35.614C304.984 35.467 305.068 35.278 305.068 35.089C305.068 34.711 304.753 34.396 304.354 34.396C304.165 34.396 304.018 34.48 303.892 34.585C303.094 35.32 302.107 35.845 300.763 35.845C298.831 35.845 297.172 34.522 296.941 32.17H304.795C305.194 32.17 305.551 31.855 305.551 31.414C305.551 28.537 303.724 25.912 300.511 25.912C297.508 25.912 295.303 28.432 295.303 31.561V31.603C295.303 34.963 297.739 37.252 300.721 37.252C302.569 37.252 303.787 36.601 304.816 35.614Z" fill="white"/>
    </svg>
  );
};
