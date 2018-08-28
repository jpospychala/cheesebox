'use strict'

const _ = require('lodash')
const MB = require('./mandelbrot-base.js')

const decimalsFormatter = (opts) => {
  const { decimals } = opts

  return (el) => {
    el.price = +el.price / 10 ** decimals
    el.amount = +el.amount / 10 ** decimals
    return el
  }
}

class MandelbrotCcxt extends MB {
  constructor (conf = {}) {
    super(conf)

    this.conf = conf

    this.ex = conf.ex
    this.user = conf.user
  }

  orderbook (q, opts = {}) {
    const pair = q.pair.replace('.', '/')
    const decimals = 10
    const account = this.user.name
    
    return this.ex.fetch_order_book( pair )
    .then(orderbook => {
      return {
        bids: orderbook.bids.map(([price, amount]) => ({price, amount})),
        asks: orderbook.asks.map(([price, amount]) => ({price, amount}))
      }
    })
  }

  orders (q, opts = {}) {
    const pair = q.pair.replace('.', '/')
    const decimals = 10
    const account = this.user.name

    const f = decimalsFormatter({ decimals: decimals })
    
    const sideEq = (side) => o => o.side === side;
    const toOrder = ({id, price, amount}) => f({
      orderId: id,
      price,
      amount,
      belongsToUser: true
    })

    return this.ex.fetch_open_orders( pair )
    .then(orders => {
      return {
        bids: orders.filter(sideEq('buy')).map(toOrder),
        asks: orders.filter(sideEq('sell')).map(toOrder)
      }
    })
  }

  cancel (q) {
    return this.ex.cancel_order(q.orderID)
  }

  place (q, opts) {
    const pair = q.pair.replace('.', '/')
    const side = q.amount > 0 ? 'buy' : 'sell'

    return this.ex.create_order(pair, 'limit', side, q.amount, q.price)
  }

  wallet () {
    return new Promise((resolve, reject) => resolve([]))
    return this.ex.fetchBalance()
      .then(balances => 
        _.toPairs(balances).map(([currency, b]) => ({currency, balance: b.total}))
      )
      .catch(ex => ([]))
  }
}

module.exports = MandelbrotCcxt
