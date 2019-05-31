import React from 'react';
import {
  Route, Switch, BrowserRouter, Redirect,
} from 'react-router-dom';
import * as containers from './ts/containers';

import './styles/normalize.scss';
import './styles/app.scss';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path={`/`} exact component={containers.Home} />
      <Route path={`/ed`} exact component={containers.Ed} />
      <Route path={`/test`} exact component={containers.Test} />
      <Redirect path="*" to={`/`} />
    </Switch>
  </BrowserRouter>
);
