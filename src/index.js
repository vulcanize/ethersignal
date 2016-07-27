import React from 'react'
import ReactDOM from 'react-dom'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import App from './components/environments/App'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
