import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { MonitorContext, UserContext } from '../contexts';
import monitorAPI from '../api';
import Loading from './Loading';

interface IProps {
  show: boolean;
  buttonTranslationKey?: string;
  createNew?: boolean;
}
const MonitorOverlay: FC<IProps> = ({
  show,
  buttonTranslationKey,
  createNew,
}) => {
  const { t } = useTranslation();
  const [userOwned, setUserOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const view = useContext(MonitorContext);
  const user = useContext(UserContext);
  let text = t(buttonTranslationKey) || t('edit-display');
  let state;
  let to;
  let search = '';
  useEffect(() => {
    if (view && user.sub && window.location.href.indexOf('url=') !== -1) {
      monitorAPI.isUserOwned(view.url).then((r: any) => {
        if (r.status === 200) {
          setUserOwned(true);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  const { pathname, href } = window.location;
  if (createNew) {
    to = '/createview';
  } else {
    if (!user?.sub) {
      if (href.indexOf('cont=') !== -1) {
        to = '/createview';
        search = window.location.search;
      } else {
        to = '/';
        text = t('login');
      }
    } else {
      // user is logged in
      if (href.indexOf('url=') !== -1) {
        // we are in a static monitor while logged in. if user owns
        // the current monitor, it can be edited, otherwise the link goes to /monitors
        to = userOwned ? `/monitors/createview` : '/monitors';
        search = userOwned ? window.location.search : '';
        text = userOwned ? t('edit-display') : t('to-own-displays');
      } else if (
        pathname.indexOf('stop') !== -1 ||
        pathname.indexOf('station') !== -1
      ) {
        // we are in a monitor defined with a url address, e.g. /stop/<gtfsId>
        to = '/monitors';
        text = t('to-own-displays');
      } else {
        // we are in a monitor created without logging in. go to create view and give the monitor
        // in state so it can be added to own displays
        to = '/monitors/createview';
        state = { view: view };
      }
    }
  }

  return (
    <div className={cx('monitor-overlay', show ? 'show' : 'show')}>
      {loading ? (
        <Loading />
      ) : (
        <Link
          className="link"
          to={{ pathname: to, state: state, search: search }}
        >
          <span>{text}</span>
        </Link>
      )}
    </div>
  );
};

export default MonitorOverlay;
