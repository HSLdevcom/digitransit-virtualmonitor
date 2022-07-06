import React, { FC, useContext, useEffect, useState } from 'react';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { defaultStopCard } from '../util/stopCardUtil';
import StopCardListDataContainer from './StopCardListDataContainer';
import Loading from './Loading';
import { getContentHash } from '../util/monitorUtils';
import { ConfigContext } from '../contexts';
interface IProps {
  user?: any; // todo: refactor when we have proper user
}

const CreateViewPage: FC<IProps> = props => {
  const config = useContext(ConfigContext);
  const [stopCardList, setStopCardList] = useState(null);
  const [languages, setLanguages] = useState(['fi']);
  const [loading, setLoading] = useState(true);
  const h = getContentHash(location.search);
  const hash = h === 'undefined' ? null : h;
  useEffect(() => {
    if (hash) {
      monitorAPI.get(hash).then((r: any) => {
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

  if (!hash || (hash && !stopCardList)) {
    return (
      <ContentContainer>
        <StopCardListContainer
          languages={languages}
          defaultStopCardList={[defaultStopCard()]}
          feedIds={config.feedIds}
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

  return (
    <ContentContainer>
      <StopCardListDataContainer
        languages={languages}
        stopIds={stopIds}
        stationIds={stationIds}
        stopCardList={stopCardList}
        feedIds={config.feedIds}
        loading={loading}
      />
    </ContentContainer>
  );
};
export default CreateViewPage;
