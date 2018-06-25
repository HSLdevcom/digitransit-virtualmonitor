import * as moment from 'moment';
import * as React from "react";
import ReactMoment from 'react-moment';
import { EpochMilliseconds, Milliseconds } from "src/time";

export interface ITimeProps {
  currentTime?: EpochMilliseconds,
  updateInterval?: Milliseconds,
};

class AutoMoment extends React.Component<ITimeProps, any> {
  public render() {
    return (
      <ReactMoment format={moment.HTML5_FMT.TIME}/>
    );
  }
};

export default AutoMoment;
