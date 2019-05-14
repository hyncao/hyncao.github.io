import React from 'react';
import {
  Route, Switch, BrowserRouter,
} from 'react-router-dom';
import * as containers from './ts/containers';

import './styles/normalize.scss';
import './styles/app.scss';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path={`/`} exact component={containers.Home} />
    </Switch>
  </BrowserRouter>
);
