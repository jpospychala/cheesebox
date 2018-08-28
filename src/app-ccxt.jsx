'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/root.jsx'
import configureStore from './configureStore.js'

import CcxtConnector from './adapters/mandelbrot-ccxt.js'

const user = { id: null, name: 'testuser4321' }
const options =  {
  apiKey: 'key',
  secret: 'pass',
  enableRateLimit: true
}
const ex = new ccxt.ethfinex(options)
ex.proxy = 'http://localhost:8080/' // 'https://crossorigin.me/'

const mb = new CcxtConnector({
  ex,
  user
})

const conf = {
  dev: true,
  user: user,
  exchangeName: 'Cantor Exchange - ccxt',
  pair: 'ETH.EUR',
  pairs: [
    'ETH.EUR',
    'ETH.USD'
  ],
  client: mb
}

const store = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <App conf={conf} />
  </Provider>
), document.getElementById('root'))
