import { importGtfs } from 'gtfs';

const config = {
  agencies: [
    {
      url: 'https://infopalvelut.storage.hsldev.com/gtfs/hsl.zip',
      exclude: [
        'shapes'
      ]
    }
  ]
};

importGtfs(config).then(x => {
  console.log(x)
})