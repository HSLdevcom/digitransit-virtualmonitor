import React, { FC } from 'react';
import packageJson from '../../package.json';
const Version: FC = () => {
  return <div>Version: {packageJson.version}</div>;
};
export default Version;
