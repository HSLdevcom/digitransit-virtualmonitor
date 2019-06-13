import * as React from 'react';
import { render } from 'react-dom';


class HelpPage extends React.Component {
public render() {
  return (
    <div>
      <h1>Virtuaalimonitorin käyttöopas</h1>
        <h2>Käytä Chromea parhaan käyttökokemuksen takaamiseksi!</h2>
        <h2>Virtuaalimonitorin käyttö selainparametrien avulla </h2>
       <p>
         Pysäkkinäytön käyttö selaimen osoiteriviltä tapahtuu seuraavasti: kirjoita osoitteen perään /stop/pysäkit/rivimäärä. Esimerkiksi /stop/tampere:0010/10 näyttää 10 riviä pysäkiltä Keskustori F. 
      </p>
      <p>
         Usean pysäkin näytön saat yksinkertaisesti lisäämällä pysäkkejä pilkulla erotettuna, esimerkiksi stop/tampere:0010,tampere:3729,tampere:3730/10.
      </p>
    </div>
  )
}
}
export default HelpPage;