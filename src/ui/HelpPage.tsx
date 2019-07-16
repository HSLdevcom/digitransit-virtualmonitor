import * as React from 'react';
import { render } from 'react-dom';

interface IHelpPageProps {
  urlParamUsageText?: string,
  urlMultipleStopsText?: string,
  urlParamFindText?: string,
  urlParamFindAltText?: string,
}

class HelpPage extends React.Component<IHelpPageProps> {
public render() {
  if(!this.props) {
    return (<p> ERROR: OHJEITA EI LÖYTYNYT</p>)
  }

  return (
    <div>
      <h1>Virtuaalimonitorin käyttöopas</h1>
        <h2>Virtuaalimonitorin käyttö selainparametrien avulla </h2>
          <p>
            {this.props.urlParamUsageText}
          </p>
          <p>
           {this.props.urlMultipleStopsText}
        </p>
        <h2> Oikean pysäkki-id:n löytäminen</h2>
         <p> {this.props.urlParamFindText}</p>
         <p> {this.props.urlParamFindAltText} </p>
        
    </div>
  )
 }
}
export default HelpPage;