import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { isInformationDisplay } from '../util/monitorUtils';
import Icon from './Icon';
import PreviewModal from './PreviewModal';
import monitorAPI from '../api';
import { getPrimaryColor, getIconStyleWithColor } from '../util/getConfig';
import StopCode from './StopCode';

interface IView {
  name?: string;
  languages: Array<string>;
  cards?: any;
  contenthash?: string;
  url?: string;
}

interface IProps {
  view: IView;
}

const UserMonitorCard: React.FC<IProps & WithTranslation> = props => {
  const { cards, name, contenthash, languages, url } = props.view;
  const [redirect, setRedirect] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const layout = cards[0].layout;

  const layouts = cards.map(c => {
    return c.layout;
  });
  const goToEdit = () => {
    setRedirect(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const onDelete = () => {
    monitorAPI.deleteStatic(contenthash, url).then(res => {
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

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: '/createStaticView',
          search: `?name=${name}&url=${url}&cont=${contenthash}`,
        }}
      />
    );
  }
  const v = {
    cards: cards,
    languages: languages,
    isInformationDisplay: isInformationDisplay(cards),
  };

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
                  const icon =
                    `${stop.locationType}-${stop.mode}`.toLowerCase();
                  const iconStyle = getIconStyleWithColor(icon);
                  const stopTitle = stop.name
                    .concat(stop.code ? ' (' + stop.code + ')' : '')
                    .concat(' - ')
                    .concat(stop.gtfsId);
                  return (
                    <li key={`stop#${j}`} title={stopTitle}>
                      <div className="icon">
                        <Icon
                          img={icon + iconStyle.postfix}
                          width={16}
                          height={16}
                          color={iconStyle.color}
                        />
                        {stop.name}
                        <StopCode code={stop.code} />
                      </div>
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
      <>
        <div className="card-container">
          <Icon img={'layout'.concat(layouts[i])} />
          <div className="data">{titlesAndStops}</div>
        </div>
      </>
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
        />
      )}
      <div className="main-container">
        <span className="layout-img">
          <Icon
            img={layouts[0] < 11 ? 'rectangle-selected' : 'vertical-selected'}
            height={32}
            width={32}
            color={getPrimaryColor()}
          />
        </span>
        <span className="monitor-name">{name}</span>
        <div className="control-buttons">
          <button className="button" onClick={() => setOpen(true)}>
            {props.t('preview')}
          </button>
          <button className="edit-button" onClick={goToEdit}>
            {props.t('modify')}
          </button>
          <div className="delete-icon" onClick={onDelete}>
            <Icon img="delete" color={getPrimaryColor()} />
          </div>
        </div>
      </div>
      <div className="cards">
        {Array.isArray(crds) &&
          crds.map((c, x) => {
            return (
              <div key={`c#${x}`} className="card-item">
                {c}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default withTranslation('translations')(UserMonitorCard);
