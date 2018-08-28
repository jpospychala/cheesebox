'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './containers/root.jsx'
import configureStore from './configureStore.js'

import FakeConnector from './adapters/mandelbrot-fake.js'

const user = { id: null, name: 'testuser4321' }

const mb = new FakeConnector({
  user
})

const conf = {
  dev: true,
  user: user,
  exchangeName: 'Cantor Exchange - fakeinex',
  pair: 'BTC.USD',
  pairs: [
    'BTC.USD',
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
