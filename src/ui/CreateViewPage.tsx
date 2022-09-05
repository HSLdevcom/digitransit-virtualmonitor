import React, { useContext, useEffect, useState } from 'react';
import StopCardListContainer from './StopCardListContainer';
import ContentContainer from './ContentContainer';
import monitorAPI from '../api';
import { defaultStopCard } from '../util/stopCardUtil';
import StopCardListDataContainer from './StopCardListDataContainer';
import Loading from './Loading';
import { UserContext } from '../contexts';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { getParams } from '../util/queryUtils';
import Modal from '@hsl-fi/modal';
import { useTranslation } from 'react-i18next';
import { IMonitor } from '../util/Interfaces';

interface Location {
  pathname: string;
  search: string;
  state: {
    view: IMonitor;
  };
}

const CreateViewPage = () => {
  const [t] = useTranslation();
  const user = useContext(UserContext);
  const location: Location = useLocation();
  const history = useHistory();
  const [stopCardList, setStopCardList] = useState(
    location?.state?.view ? location.state.view.cards : null,
  );
  const [languages, setLanguages] = useState(['fi']);
  const [staticMonitorProperties, setStaticMonitorProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noMonitorFound, setNoMonitorFound] = useState(false);
  const [showMonitorInfoModal, setShowMonitorInfoModal] = useState(
    !!location?.state?.view,
  );
  const { url, cont: hash } = getParams(location.search);
  useEffect(() => {
    if (noMonitorFound) {
      // The monitor we are trying to access doesn't exist or it's owned
      // by another user. show empty create page and clean up url params
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
    const controller = new AbortController();
    if (hash) {
      monitorAPI
        .get(hash, controller.signal)
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
    } else if (url && user.sub) {
      monitorAPI.isUserOwned(url, controller.signal).then((res: Response) => {
        if (res.status === 200) {
          monitorAPI
            .getStatic(url, controller.signal)
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
          setNoMonitorFound(true);
        }
      });
    } else {
      if (!location.state?.view) {
        setNoMonitorFound(true);
      }
      setLoading(false);
    }
    return () => {
      controller.abort();
    };
  }, []);
  if (
    stopCardList &&
    user.sub &&
    location.pathname.toLowerCase() === '/createview' &&
    location.search.indexOf('cont=') != -1
  ) {
    // user is logged in and is attempting to modify a monitor created without logging in.
    // redirect and render pre-filled create new monitor-page
    return (
      <Redirect
        to={{
          pathname: '/monitors/createview',
          state: { view: { cards: stopCardList, languages: languages } },
        }}
      />
    );
  }

  if (
    user.sub &&
    location.pathname.toLowerCase() === '/createview' &&
    !url &&
    !hash &&
    !location.state?.view
  ) {
    return <Redirect to={{ pathname: '/monitors/createview' }} />;
  }

  if (((!hash && !url) || noMonitorFound) && !location?.state?.view) {
    return (
      <ContentContainer>
        <StopCardListContainer
          languages={languages}
          stopCards={[defaultStopCard()]}
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
      {showMonitorInfoModal && (
        <Modal
          appElement="#root"
          closeButtonLabel={t('close')}
          isOpen
          variant="small"
          onCrossClick={() => setShowMonitorInfoModal(false)}
          onClose={() => setShowMonitorInfoModal(false)}
          shouldCloseOnEsc
          shouldCloseOnOverlayClick
        >
          <div className="monitor-modal-content">
            <div className="message">{t('non-logged-in-monitor-info')}</div>
            <div className="monitor-modal-buttons">
              <button
                className="monitor-button blue"
                onClick={() => setShowMonitorInfoModal(false)}
              >
                {t('ok')}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <StopCardListDataContainer
        languages={languages}
        staticMonitor={staticMonitorProperties}
        stopIds={stopIds}
        stationIds={stationIds}
        stopCardList={stopCardList}
        loading={loading}
      />
    </ContentContainer>
  );
};
export default CreateViewPage;
