import * as moment from 'moment';
import * as React from "react";
import ReactMoment from 'react-moment';

import NtpSyncContext from '../ntp/NtpSyncContext';
import { EpochMilliseconds, Milliseconds } from "../time";

export interface ITimeProps {
  readonly currentTime?: EpochMilliseconds,
  readonly updateInterval?: Milliseconds,
};

class AutoMoment extends React.Component<ITimeProps, any> {
  constructor (props: ITimeProps) {
    super(props);
  }

  static get contextType() {
    return NtpSyncContext;
  }

  public render() {
    return (
      <ReactMoment
        interval={20000}
        format={moment.HTML5_FMT.TIME}
        add={{ milliseconds: this.context.delta }}
      />
    );
  }
};

export default AutoMoment;
