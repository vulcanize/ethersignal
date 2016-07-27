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

import Frame from './components/environments/Frame'
import Home from './components/environments/Home'
import About from './components/environments/About'
import CliQuickstart from './components/environments/CliQuickstart'

export const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/cliquickstart', name: 'Cli QuickStart', component: CliQuickstart }
]

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Frame}>
        <IndexRoute component={Home} />
        {
          routes.slice(1).map((route, index) => {
            return (
              <Route key={index} path={route.path} component={route.component} />
            )
          })
        }
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
