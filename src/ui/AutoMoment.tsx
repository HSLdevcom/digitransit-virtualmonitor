import * as React from 'react';
import { DateTime } from 'luxon';

import NtpSyncContext from '../ntp/NtpSyncContext';
import { EpochMilliseconds, Milliseconds } from '../time';

export interface ITimeProps {
  readonly currentTime?: EpochMilliseconds;
}

class AutoMoment extends React.Component<ITimeProps, any> {
  constructor(props: ITimeProps) {
    super(props);
  }

  static get contextType() {
    return NtpSyncContext;
  }

  public render() {
    const dt = DateTime.fromMillis(
      this.props.currentTime + this.context.deltaMilliseconds,
    );
    const hours = dt.toFormat('HH');
    const minutes = dt.toFormat('mm');
    return (
      <time>
        {hours}
        <span>:</span>
        {minutes}
      </time>
    );
  }
}

export default AutoMoment;
