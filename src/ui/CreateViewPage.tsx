import React, { useContext, useEffect, useState } from 'react';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { defaultStopCard } from '../util/stopCardUtil';
import StopCardListDataContainer from './StopCardListDataContainer';
import Loading from './Loading';
import { ConfigContext } from '../contexts';
import { useHistory, useLocation } from 'react-router-dom';
import { getParams } from '../util/queryUtils';

const CreateViewPage = () => {
  const config = useContext(ConfigContext);
  const location = useLocation();
  const history = useHistory();
  const [stopCardList, setStopCardList] = useState(null);
  const [languages, setLanguages] = useState(['fi']);
  const [staticMonitorProperties, setStaticMonitorProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noMonitorFound, setNoMonitorFound] = useState(false);
  const { url, cont: hash } = getParams(location.search);

  useEffect(() => {
    if (noMonitorFound) {
      // The monitor we are trying to access doesn't exist, show empty
      // create page and silently clean up url params
      const queryParams = new URLSearchParams(location.search);
      queryParams.forEach((_, key, s) => {
        s.delete(key);
      });
      history.replace({
        search: queryParams.toString(),
      });
    }
  }, [noMonitorFound]);

  useEffect(() => {
    if (hash) {
      monitorAPI
        .get(hash)
        .then((r: any) => {
          if (r?.cards?.length) {
            setStopCardList(r.cards);
            if (r.languages) {
              setLanguages(r.languages);
            }
          }
          setLoading(false);
        })
        .catch(() => setNoMonitorFound(true));
    } else if (url) {
      monitorAPI
        .getStatic(url)
        .then((r: any) => {
          if (r?.cards?.length) {
            setStopCardList(r.cards);
            if (r.languages) {
              setLanguages(r.languages);
            }
            setStaticMonitorProperties({ name: r.name, id: r.id });
          }
          if (!r.cards) {
            setNoMonitorFound(true);
          }
          setLoading(false);
        })
        .catch(() => setNoMonitorFound(true));
    } else {
      setLoading(false);
    }
  }, []);

  if ((!hash && !url) || noMonitorFound) {
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
  if (loading) {
    return <Loading white />;
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
        languages={languages}
        staticMonitor={staticMonitorProperties}
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
