import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { getConfig } from '../util/getConfig';
import CarouselContainer from "./CarouselContainer";
import Monitor from './Monitor';

interface IProps {
  readonly location?: any;
}
const WithDatabaseConnection: FC<IProps> = ({ location }) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!location?.state?.view?.cards) {
      const hash: any = location.search.split('cont=');
      monitorAPI.get(hash[1]).then(r => {
        setFetched(true);
        setView(r);
      });
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view.cards;
  if ((!fetched && !location?.state?.view?.cards) || !monitor?.contenthash) {
    return <div>loading..</div>;
  }
  return <CarouselContainer views={monitor.cards} />;
};

export default WithDatabaseConnection;
