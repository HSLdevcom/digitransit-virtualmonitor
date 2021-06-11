const config = {
    endpoint: process.env.APPSETTING_DB_ENDPOINT || 'X',
    key: process.env.APPSETTING_DB_KEY || 'X',
    databaseId: process.env.APPSETTING_DB_ID || 'X',
    containerId: process.env.APPSETTING_DB_CONTAINER || 'X',
    partitionKey: { kind:  'Hash', paths: ['/contenthash'] }
};
module.exports = config;