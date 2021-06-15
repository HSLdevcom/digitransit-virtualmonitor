import React, { FC, useState, useEffect } from 'react';
import monitorAPI from '../api';
import { getParams } from '../util/queryUtils';
import Monitor from './Monitor';

interface IProps {
  readonly location?: any;
}
const WithDatabaseConnection : FC<IProps> = ({location}) => {
  const [view, setView] = useState({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!location?.state?.view) {
      const hash: any = location.search.split('cont=');
      const foo = hash[1]
      monitorAPI.get(foo).then(r => {
        console.log("monitor", r)
        setFetched(true);
        setView(r);});
    }
  }, [])

  console.log(location?.state?.view)
  const monitor = fetched ? view : location?.state?.view;
  if (!fetched && !location?.state?.view || !monitor?.contenthash) {
    return <div>loading..</div>
  }

  console.log("render",monitor)
  //return <div>asdasdasd</div>

  return (
    <Monitor view={monitor}/>
  )
}

export default WithDatabaseConnection;