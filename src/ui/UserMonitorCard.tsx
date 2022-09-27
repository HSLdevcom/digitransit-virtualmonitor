import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import PreviewModal from './PreviewModal';
import monitorAPI from '../api';
import {
  getTrainStationData,
  isPlatformOrTrackVisible,
} from '../util/monitorUtils';
import DeleteModal from './DeleteModal';
import { ConfigContext } from '../contexts';
import InputWithEditIcon from './InputWithEditIcon';

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
  onDelete: any;
  preview?: boolean;
  setTitle?: (string) => void;
}

const UserMonitorCard: React.FC<IProps> = ({
  view,
  onDelete,
  preview = false,
  setTitle,
}) => {
  let to;
  const [t] = useTranslation();
  const config = useContext(ConfigContext);
  const { cards, name, languages, url, id } = view;
  const [isOpen, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const layout = cards[0].layout;
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    return () => clearTimeout(to);
  }, []);

  const onDeleteCallBack = () => {
    setDeleting(true);
    monitorAPI.deleteStatic(view.id, url).then(res => {
      onDelete(true);
      setDeleteModalOpen(false);
      setDeleting(false);
    });
  };

  const v = {
    cards: cards,
    languages: languages,
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
    const multipleCols = c.layout >= 9 && c.layout <= 11;
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
            <React.Fragment key={`display${c}`}>
              <div className="card-title">{colTitles[c]}</div>
              <div className="stop-list">
                {colStop.map((stop, j) => {
                  const stopCode = `(${stop.code})`;
                  const icon =
                    stop.locationType === 'STATION' || stop.mode === 'SUBWAY'
                      ? `station-${stop.mode.toLowerCase()}`
                      : `stop-${stop.mode.toLowerCase()}`;
                  return (
                    <li key={`stop#${j}`}>
                      <Icon
                        img={icon}
                        color={
                          config.modeIcons.colors[
                            `mode-${stop.mode.toLowerCase()}`
                          ]
                        }
                      />
                      {`${stop.name} ${stop.code ? stopCode : ''}`}
                    </li>
                  );
                })}
              </div>
            </React.Fragment>
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
  const isHorizontal = layout < 12 || layout === 18;
  return (
    <>
      <div className="main-container">
        {showModal && (
          <div className="alert-modal animate-in">{t('link-copied')}</div>
        )}
        {isOpen && (
          <PreviewModal
            languages={languages}
            view={v}
            isOpen={isOpen}
            onClose={onClose}
            isLandscape={isHorizontal}
            stations={stations}
            stops={stops}
            showPlatformsOrTracks={showPlatformsOrTracks}
          />
        )}
        {deleteModalOpen && (
          <DeleteModal
            name={name}
            onDeleteCallBack={onDeleteCallBack}
            setDeleteModalOpen={setDeleteModalOpen}
            loading={deleting}
          />
        )}
        <div className="layout-img">
          <Icon
            img={'rectangle-selected'}
            rotate={isHorizontal ? '0' : '90'}
            height={32}
            width={32}
            color={config.colors.primary}
          />
        </div>
        <div className="monitor-name">
          {setTitle ? (
            <InputWithEditIcon
              value={name}
              id={id}
              onChange={title => setTitle(title)}
            />
          ) : (
            name
          )}
        </div>
        {!preview && (
          <div className="delete-button-container">
            <button
              className="delete-icon"
              onClick={() => setDeleteModalOpen(true)}
              aria-label={t('delete-display', { id: name })}
            >
              <Icon img="delete" color={config.colors.primary} />
            </button>
          </div>
        )}
      </div>
      <div className="cards">{crds}</div>
      {!preview && (
        <div className="buttons-container">
          <div className="main-buttons-container">
            <button
              className="monitor-button white"
              onClick={() => setOpen(true)}
            >
              {t('preview')}
            </button>
            <Link
              tabIndex={0}
              className="monitor-button white"
              to={`/monitors/createview?&url=${url}`}
            >
              {t('modify')}
            </Link>
            <Link
              tabIndex={0}
              className="monitor-button white"
              to={`/static?&url=${url}`}
            >
              {t('open')}
            </Link>
          </div>
          <button
            className="monitor-button white"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.host}/static?url=${url}`,
              );
              setShowModal(true);
              clearTimeout(to);
              to = setTimeout(() => setShowModal(false), 3000);
            }}
          >
            {t('copy')}
          </button>
        </div>
      )}
    </>
  );
};

export default UserMonitorCard;
