const config = {
  endpoint: process.env.APPSETTING_DB_ENDPOINT || 'X',
  key: process.env.APPSETTING_DB_KEY || 'X',
  databaseId: process.env.APPSETTING_DB_ID || 'X',
  containerId: process.env.APPSETTING_DB_CONTAINER || 'X',
  partitionKey: { kind: 'Hash', paths: ['/contenthash'] },
};
export default config;

export function parseEnvPropJSON(envProperty, envPropertyName) {
  try {
    const propertyJson = JSON.parse(envProperty);
    if (typeof propertyJson !== 'object') {
      throw new Error(
        `Property ${envPropertyName} is not an object. Expected a JSON object.`
      );
    }
    return propertyJson;
  } catch (error) {
    console.error(error, 'Falling back to assuming HSL OIDC configuration.');
    return {
      hsl: envProperty,
    };
  }
}
