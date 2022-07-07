import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Redirect } from 'react-router-dom';
import { isInformationDisplay } from '../util/monitorUtils';
import Icon from './Icon';
import PreviewModal from './PreviewModal';
import monitorAPI from '../api';
import { getPrimaryColor } from '../util/getConfig';
import {
  getTrainStationData,
  isPlatformOrTrackVisible,
} from '../util/monitorUtils';

interface IView {
  name?: string;
  languages: Array<string>;
  cards?: any;
  contenthash?: string;
  url?: string;
  id: string;
}

interface IProps {
  view: IView;
}

const UserMonitorCard: React.FC<IProps> = props => {
  const [t] = useTranslation();
  const { cards, name, contenthash, languages, url } = props.view;
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const layout = cards[0].layout;

  const onClose = () => {
    setOpen(false);
  };

  const onDelete = () => {
    monitorAPI.deleteStatic(props.view.id, url).then(res => {
      setDelete(true);
    });
  };

  if (isDelete) {
    return (
      <Redirect
        to={{
          pathname: '/',
          search: `?pocLogin`,
        }}
      />
    );
  }

  const v = {
    cards: cards,
    languages: languages,
    isInformationDisplay: isInformationDisplay(cards),
  };

  const stations = v ? getTrainStationData(v, 'STATION') : [];
  const stops = v ? getTrainStationData(v, 'STOP') : [];
  const showPlatformsOrTracks =
    stations.length || stops.length ? isPlatformOrTrackVisible(v) : false;

  const getTitles = obj => {
    let titles = '';
    languages.forEach((lang, x) => {
      if (x !== 0) {
        titles += ' / ';
      }
      titles += obj.title[lang];
    });
    return titles;
  };

  const crds = cards.map((c, i) => {
    const cols = c.columns;
    const multipleCols = cols.right.inUse;
    const colStops = multipleCols
      ? [cols.left.stops, cols.right.stops]
      : [cols.left.stops];

    const colTitles = multipleCols
      ? [getTitles(cols.left), getTitles(cols.right)]
      : [getTitles(c)];

    const titlesAndStops = (
      <ul key={`card#${i}`}>
        {colStops.map((colStop, c) => {
          return (
            <>
              <div className="card-title">{colTitles[c]}</div>
              <div className="stop-list">
                {colStop.map((stop, j) => {
                  const stopTitle = stop.name
                    .concat(stop.code ? ' (' + stop.code + ')' : '')
                    .concat(' - ')
                    .concat(stop.gtfsId);
                  return (
                    <li key={`stop#${j}`} title={stopTitle}>
                      {`${stop.name} (${stop.code})`}
                    </li>
                  );
                })}
              </div>
            </>
          );
        })}
      </ul>
    );

    return (
      <div key={`c#${i}`} className="card-item">
        <div className="card-container">
          <Icon img={'layout'.concat(c.layout)} />
          <div className="data">{titlesAndStops}</div>
        </div>
      </div>
    );
  });
  return (
    <div className={'card'}>
      {isOpen && (
        <PreviewModal
          languages={languages}
          view={v}
          isOpen={isOpen}
          onClose={onClose}
          isLandscape={layout < 11}
          stations={stations}
          stops={stops}
          showPlatformsOrTracks={showPlatformsOrTracks}
        />
      )}
      <div className="main-container">
        <div className="layout-img">
          <Icon
            img={'rectangle-selected'}
            rotate={cards[0].layout < 11 ? '0' : '90'}
            height={32}
            width={32}
            color={getPrimaryColor()}
          />
        </div>
        <div className="monitor-name">{name}</div>
        <button className="round-button" onClick={() => setOpen(true)}>
          {t('preview')}
        </button>
        <Link className="round-button" to={`/monitors/createView?&url=${url}`}>
          {t('modify')}
        </Link>
        <div className="delete-icon" onClick={onDelete}>
          <Icon img="delete" color={getPrimaryColor()} />
        </div>
      </div>
      <div className="cards">{crds}</div>
    </div>
  );
};

export default UserMonitorCard;
