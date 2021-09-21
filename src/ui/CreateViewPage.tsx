import React, { useEffect, useState } from 'react';
import { IMonitorConfig } from '../App';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { withTranslation, WithTranslation } from 'react-i18next';
import { defaultStopCard } from '../util/stopCardUtil';
import StopCardListDataContainer from './StopCardListDataContainer';
import Loading from './Loading';

interface IConfigWithFeedIs extends IMonitorConfig {
  feedIds?: Array<string>;
}
interface IProps {
  config: IConfigWithFeedIs;
  user?: any; // todo: refactor when we have proper user
}

const CreateViewPage: React.FC<IProps & WithTranslation> = props => {
  const [stopCardList, setStopCardList] = useState(null);
  const [languages, setLanguages] = useState(['fi']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash: any = location.search.split('cont=');
    if (hash[1]) {
      monitorAPI.get(hash[1]).then((r: any) => {
        if (r?.cards?.length) {
          setStopCardList(r.cards);
          if (r.languages) {
            setLanguages(r.languages);
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  console.log('location.search:', location.search);
  const hash: any = location.search.split('cont=');

  if (hash[1] && !stopCardList) {
    return null;
  }
  if (!hash[1]) {
    return (
      <ContentContainer>
        <StopCardListContainer
          user={props.user}
          languages={languages}
          defaultStopCardList={[defaultStopCard(props.t)]}
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
  if (loading) {
    return <Loading white />;
  }
  console.log('And continuing...');
  return (
    <ContentContainer>
      <StopCardListDataContainer
        user={props.user}
        languages={languages}
        stopIds={stopIds}
        stationIds={stationIds}
        stopCardList={stopCardList}
        feedIds={props.config.feedIds}
        loading={loading}
        viewName={name}
      />
    </ContentContainer>
  );
};
export default withTranslation('translations')(CreateViewPage);
