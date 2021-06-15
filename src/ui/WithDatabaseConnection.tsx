import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { getConfig } from '../util/getConfig';
import Monitor from './Monitor';

interface IProps {
  readonly location?: any;
}
const WithDatabaseConnection: FC<IProps> = ({ location }) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!location?.state?.view) {
      const hash: any = location.search.split('cont=');
      monitorAPI.get(hash[1]).then(r => {
        setFetched(true);
        setView(r);
      });
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view;
  if ((!fetched && !location?.state?.view) || !monitor?.contenthash) {
    return <div>loading..</div>;
  }
  const config = getConfig();
  return <Monitor view={monitor} config={config}/>;
};

export default WithDatabaseConnection;
