import React, { useEffect, useState } from 'react';
import { IMonitorConfig } from '../App';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { withTranslation, WithTranslation } from 'react-i18next';
import { defaultStopCard } from '../util/stopCardUtil';
import StopCardListDataContainer from './StopCardListDataContainer';

interface IConfigWithFeedIs extends IMonitorConfig {
  feedIds?: Array<string>;
}
interface IProps {
  config: IConfigWithFeedIs;
}

const CreateViewPage: React.FC<IProps & WithTranslation> = props => {
  const [stopCardList, setStopCardList] = useState(null);
  const [languages, setLanguages] = useState(['fi']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash: any = location.search.split('cont=');
    if (hash[1]) {
      setLoading(true);
      monitorAPI.get(hash[1]).then((r: any) => {
        if (r?.cards?.length) {
          setLoading(false);
          setStopCardList(r.cards);
          if (r.languages) {
            setLanguages(r.languages);
          }
        }
      });
    }
  }, []);

  const hash: any = location.search.split('cont=');
  if (hash[1] && !stopCardList) {
    return <div>Loading...</div>;
  }
  if (!hash[1]) {
    return (
      <ContentContainer>
        <StopCardListContainer
          defaultStopCardList={[defaultStopCard]}
          feedIds={props.config.feedIds}
        />
      </ContentContainer>
    );
  }
  const stopIds = [];
  const stationIds = [];
  stopCardList.forEach(stopCard => {
    stopCard.columns.left.stops.forEach(s =>
      s.locationType === 'STOP'
        ? stopIds.push(s.gtfsId)
        : stationIds.push(s.gtfsId),
    );
    stopCard.columns.right.stops.forEach(s =>
      s.locationType === 'STOP'
        ? stopIds.push(s.gtfsId)
        : stationIds.push(s.gtfsId),
    );
  });
  return (
    <ContentContainer>
      <StopCardListDataContainer
        stopIds={stopIds}
        stationIds={stationIds}
        stopCardList={stopCardList}
        feedIds={props.config.feedIds}
      />
    </ContentContainer>
  );
};
export default withTranslation('translations')(CreateViewPage);
