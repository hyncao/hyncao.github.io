import React from 'react';
import {
  Route, Switch, BrowserRouter, Redirect,
} from 'react-router-dom';
import * as containers from './containers';

// 配置全局变量
window.globalAppUrl = 'http://172.16.57.88:8888';
window.globalAppSource = '/broadband-web';

const { globalAppSource } = window;

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={containers.Home} />
      <Redirect path="*" to="/" />
    </Switch>
  </BrowserRouter>
);
