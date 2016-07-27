import React from 'react'
import {render} from 'react-dom'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import { Provider } from 'react-redux'
import { createStore,  applyMiddleware } from 'redux'
import appReducer from './redux/reducers'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

const logger = createLogger()
const store = createStore(
  appReducer,
  applyMiddleware(thunk, logger)
)

import Home from './components/environments/Home'
import Frame from './components/environments/Frame'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Frame}>
        <IndexRoute component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
