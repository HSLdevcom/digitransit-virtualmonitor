export function getLoginUri(configName) {
  switch (configName) {
    case 'tampere':
    case 'jyvaskyla':
    case 'vaasa':
      return 'waltti-login';
      break;
    case 'hsl':
      return 'hsl-login?url=/&';
      break;
    default:
      return '';
  }
}
