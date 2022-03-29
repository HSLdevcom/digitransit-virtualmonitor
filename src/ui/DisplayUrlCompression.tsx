import React, { useState, useEffect } from 'react';
import OldMonitorParser from './OldMonitorParser';
import Loading from './Loading';
import monitorAPI from '../api';
interface IDisplayUrlCompressionProps {
  readonly version: string;
  readonly packedString: string;
}

const DecompressOldMonitor = ({ base64string }) => {
  const [display, setDisplay] = useState({});
  const [loading, setLoading] = useState(true);

  const getDisplay = () => {
    return monitorAPI.decompress(base64string);
  };

  useEffect(() => {
    getDisplay().then(res => {
      setDisplay(res);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <Loading />;
  }
  return <OldMonitorParser display={display} />;
};

const DisplayUrlCompression = ({
  version,
  packedString,
}: IDisplayUrlCompressionProps) => (
  <DecompressOldMonitor base64string={packedString} />
);

export default DisplayUrlCompression;
