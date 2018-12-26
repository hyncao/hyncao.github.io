import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Routes from './Routes';

// 载入全局样式
import '../style/normalize.scss';
import '../style/app.scss';
import '../style/font.scss';

const rootEl = document.getElementById('app');
const store = configureStore(window.__INITIAL_STATE__);
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2',
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

render(
  <AppContainer>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Routes />
      </MuiThemeProvider>
    </Provider>
  </AppContainer>,
  rootEl,
);
