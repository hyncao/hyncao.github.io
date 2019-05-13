import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import Routes from './Routes';

// 载入全局样式
import '../style/normalize.scss';
import '../style/app.scss';
import '../style/font.scss';
import '../style/highlight/github.css';

const rootEl = document.getElementById('app');

render(
  <AppContainer>
    <Routes />
  </AppContainer>,
  rootEl,
);
