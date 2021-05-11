import * as React from 'react';

import { Route, Switch } from 'react-router-dom';
import StopSelector from './StopSelector';

const StopSelectorSwitch = () => (
  <Switch>
    <Route path={'/searchStop/:phrase?'} component={StopSelector} />
    <Route component={StopSelector} />
  </Switch>
);

export default StopSelectorSwitch;