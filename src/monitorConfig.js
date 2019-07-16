export default {
   tampere: {
     feedId: 'tampere',
      uri: 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql',
      // Texts for Help page
      urlParamUsageText: 'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/tampere:0010/10 näyttää 10 riviä pysäkiltä Keskustori F.',
      urlMultipleStopsText: 'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi stop/tampere:0010,tampere:3729,tampere:3730/10.',
      urlParamFindText: 'Pysäkki-id on sama kuin pysäkin numero. Esimerkiksi Keskusterori F:n pysäkiltä saat kirjoittamalla tampere:0010. Pysäkkinumerot löytyvät esimerkiksi Reittioppaasta.',
      urlParamFindAltText: '',
  },
    hsl: {
      feedId: 'hsl',
      uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', 
      urlParamUsageText: 'Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/HSL:1230109/10 Näyttää 10 riviä pysäkiltä Kumpulan kampus',
      urlMultipleStopsText: 'Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi stop/HSL:123010,HSL:123010/10.',
      urlParamFindText: 'Löydät oikean pysäkki-id:n helposti esimerkiksi reittioppaasta: Siirry halutun pysäkin pysäkkinäkymään, ja katso urlin lopusta pysäkki-id. ',
      urlParamFindAltText: 'Esimerkiksi reittiopas.hsl.fi/pysakit/HSL%3A123010 nähdään, että pysäkki-id on HSL:123010. Huomaathan että %3A on HTML koodia, ja se tarkoittaa : merkkiä.',
    }
};


