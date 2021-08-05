import React from 'react';
interface IStopCode {
  readonly code: string;
}

const StopCode: React.FunctionComponent<IStopCode> = ({ code }) => {
  return (code && <span className="stop-code">{code}</span>) || null;
};

export default StopCode;
