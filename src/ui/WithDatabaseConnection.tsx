import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { ISides, ITitle } from '../util/Interfaces';
import CarouselContainer from './CarouselContainer';
import TranslationContainer from './TranslationContainer';

interface Iv {
  columns: ISides;
  duration: number;
  id: number;
  layout: number;
  title: ITitle;
  cards?: any;
  contenthash?: string;
}
interface IState {
  view: Iv;
}
interface ILocation {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: IState;
}
interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly location?: ILocation;
}
const WithDatabaseConnection: FC<IProps> = ({ location }) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!location?.state?.view?.cards) {
      const hash: Array<string> = location.search.split('cont=');
      monitorAPI.get(hash[1]).then(r => {
        setFetched(true);
        setView(r);
      });
    }
  }, []);

  const monitor = fetched ? view : location?.state?.view.cards;
  if ((!fetched && !location?.state?.view?.cards) || !monitor?.contenthash) {
    return null;
  }
  return <TranslationContainer views={monitor.cards} />;
};

export default WithDatabaseConnection;
