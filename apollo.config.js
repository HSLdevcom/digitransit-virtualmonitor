module.exports = {
  client: {
      service: {
        name: 'otp-virtual-monitor',
        url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      },
      excludes: ['node_modules/**/*', 'src/ui/TrainDataFetcher.tsx']
   },
};
