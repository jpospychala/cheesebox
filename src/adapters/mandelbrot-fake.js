'use strict'

const MB = require('./mandelbrot-base.js')

class MandelbrotFake extends MB {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf
    this.user = conf.user
  }

  orderbook (q, opts = {}) {
    const pair = q.pair
    const decimals = 10
    const account = this.user.name

    return new Promise((resolve, reject) => {
      resolve({
        asks: [
          {orderID: 'a1', price: '1.00', amount: '1', belongsToUser: false},
          {orderID: 'a2', price: '1.01', amount: '1', belongsToUser: true},
        ],
        bids: [
          {orderID: 'b1', price: '1.00', amount: '1', belongsToUser: false},
          {orderID: 'b2', price: '1.01', amount: '1', belongsToUser: true},
        ]
      })
    })
  }

  orders (q, opts = {}) {
    const { pair } = q
    const decimals = 10

    return new Promise((resolve, reject) => {
      resolve({
        asks: [
          {orderID: 'a1', price: '1.00', amount: '1', belongsToUser: false},
          {orderID: 'a2', price: '1.01', amount: '1', belongsToUser: true},
        ],
        bids: [
          {orderID: 'b1', price: '1.00', amount: '1', belongsToUser: false},
          {orderID: 'b2', price: '1.01', amount: '1', belongsToUser: true},
        ]
      })
    })
  }

  cancel (q) {
    return new Promise((resolve, reject) => {
      console.log('cancelling', q)
      resolve({})
    })
  }

  place (q, opts) {
    return new Promise((resolve, reject) => {
      console.log('placing', q)
      resolve({})
    })
  }

  wallet () {
    return new Promise((resolve, reject) => {
        resolve([
          {currency: 'BTC', balance: '1.00'},
          {currency: 'USD', balance: '2.00'}
        ])
    })
  }
}

module.exports = MandelbrotFake
