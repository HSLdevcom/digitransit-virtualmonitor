import React = require('react');

import AutoMoment from 'src/ui/AutoMoment';

const TitlebarTime = () => (
  <div id={'title-time'} style={{fontSize: 'min(4vw, 4em)'}}>
    <AutoMoment />
  </div>
);

export default TitlebarTime;
