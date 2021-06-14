import React, { useEffect } from 'react';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
interface IHelpPageProps {
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
  client: any;
}

const HelpPage: React.FC<IHelpPageProps> = props => {
  useEffect(() => {
    monitorAPI.get().then(json => console.log(json));
  }, []);
  if (!props) {
    return <p> ERROR: OHJEITA EI LÖYTYNYT</p>;
  }

  return (
    <>
      <ContentContainer>
        <div>
          <h1>Virtuaalimonitorin käyttöopas</h1>
          <h2>Virtuaalimonitorin käyttö selainparametrien avulla </h2>
          <p>{props.urlParamUsageText}</p>
          <p>{props.urlMultipleStopsText}</p>
          <h2> Oikean pysäkki-id:n löytäminen</h2>
          <p> {props.urlParamFindText}</p>
          <p> {props.urlParamFindAltText} </p>
        </div>
      </ContentContainer>
    </>
  );
};
export default HelpPage;
