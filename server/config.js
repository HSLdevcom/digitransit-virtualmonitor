const config = {
    endpoint: process.env.DB_ENDPOINT || 'X',
    key: process.env.DB_KEY || 'X',
    databaseId: process.env.DB_ID || 'X',
    containerId: process.env.DB_CONTAINER || 'X',
    partitionKey: { kind:  'Hash', paths: ['/contenthash'] }
};
module.exports = config;