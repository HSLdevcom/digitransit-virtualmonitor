import React, { useEffect } from 'react';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { useLocation } from 'react-router';
const newItem = {
  contenthash: 'abc122aa231',
  monitors: [
    {
      id: 1,
      title: 'Jannen monitori',
      stops: [
        {
          code: 'H0132',
          desc: 'Mannerheimintie',
          gtfsId: 'HSL:1180444',
          hiddenRoutes: [
            {
              __typename: 'Route',
              shortName: '8H',
              gtfsId: 'HSL:1008H',
            },
          ],
          name: 'Kuusitie',
          platformCode: null,
        },
      ],
      layout: 2,
      time: 5,
    },
    {
      id: 2,
      title: 'Bar',
      stops: [
        {
          code: 'H1501',
          desc: 'Neulastie',
          gtfsId: 'HSL:1333105',
          hiddenRoutes: [
            {
              __typename: 'Route',
              shortName: '39N',
              gtfsId: 'HSL:1039N',
            },
          ],
          name: 'Neulastie',
          platformCode: null,
        },
        {
          __typename: 'Stop',
          name: 'Hesperian puisto',
          code: 'H1909',
          desc: 'Mannerheimintie',
          gtfsId: 'HSL:1130206',
          platformCode: null,
          hiddenRoutes: [],
        },
      ],
      layout: 2,
      time: 5,
    },
  ],
};

interface IHelpPageProps {
  urlParamUsageText?: string;
  urlMultipleStopsText?: string;
  urlParamFindText?: string;
  urlParamFindAltText?: string;
  client: any;
  content?: string;
}

const HelpPage: React.FC<IHelpPageProps> = props => {
  const location = useLocation();
  console.log(location);
  useEffect(() => {
    monitorAPI.create(newItem).then(json => console.log(json));
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
