import * as React from 'react';

import NtpSyncContext from './NtpSyncContext';

interface INtpSyncComponent {
  children: React.ReactChild,
}

interface INtpSyncComponentState {
  deltaMilliseconds: number,
}

class NtpSyncComponent extends React.Component<INtpSyncComponent, INtpSyncComponentState> {
  constructor (props: INtpSyncComponent) {
    super(props);
    this.state = {
      deltaMilliseconds: 0,
    };
    this.retrieveTimeDelta();
  }

  public render() {
    return (
      <NtpSyncContext.Provider
        value={this.state}
      >
        {this.props.children}
      </NtpSyncContext.Provider>
    );
  }

  protected retrieveTimeDelta = async () => {
    try {
      const res = await fetch('https://use.ntpjs.org/v1/time.json');
      const remoteTime = await res.json();
      if (remoteTime.now) {
        this.setState({
          deltaMilliseconds: remoteTime.now * 1000 - new Date().getTime(),
        });
      } else {
        this.setState({
          deltaMilliseconds: 0,
        });
      }
    } catch (e) {
      this.setState({
        deltaMilliseconds: 0,
      });
    }
  };
}

export default NtpSyncComponent;
