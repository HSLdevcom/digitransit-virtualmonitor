import * as React from 'react';

import NtpSyncContext from 'src/ntp/NtpSyncContext';

interface INtpSyncComponent {
  children: React.ReactChild,
};

interface INtpSyncComponentState {
  delta: number,
};

class NtpSyncComponent extends React.Component<INtpSyncComponent, INtpSyncComponentState> {
  constructor (props: INtpSyncComponent) {
    super(props);
    this.state = {
      delta: 0,
    };
    this.retrieveTimeDelta();
  }

  retrieveTimeDelta = async () => {
    try {
      const res = await fetch('https://use.ntpjs.org/v1/time.json');
      const remoteTime = await res.json();
      if (remoteTime.now) {
        this.setState({
          delta: remoteTime.now * 1000 - new Date().getTime(),
        });
      } else {
        this.setState({
          delta: 0,
        });
      }
    } catch (e) {
      this.setState({
        delta: 0,
      });
    }
  };

  public render() {
    return (
      <NtpSyncContext.Provider
        value={this.state}
      >
        {this.props.children}
      </NtpSyncContext.Provider>
    );
  };
}

export default NtpSyncComponent;
