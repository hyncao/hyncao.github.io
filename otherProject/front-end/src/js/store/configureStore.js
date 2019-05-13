import { createStore, /* applyMiddleware, */ compose } from 'redux';
import rootReducer from '../reducers';

const configureStore = (preloadedState) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      // applyMiddleware(sagaMiddleware),
      // applyMiddleware 是redux的原生方法，它将所有中间件组成一个数组，依次执行。
    ),
  );
  return store;
};

export default configureStore;
