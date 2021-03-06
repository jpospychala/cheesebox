/* eslint-env mocha */

'use strict'
const assert = require('assert')

const MWsHive = require('../src/adapters/mandelbrot-ws-hive.js')
const Wock = require('./ws-testhelper.js')

describe('websockets', () => {
  it('subscribes to order books', (done) => {
    const wss = new Wock({
      port: 8888
    })

    wss.messageHook = (ws, msg) => {
      if (msg.event === 'subscribe') {
        wss.send(ws, {
          event: 'subscribed',
          channel: 'book',
          chanId: '123btcusd',
          symbol: 'BTCUSD'
        })
      }

      setTimeout(() => {
        // simulate ob snapshot
        wss.send(ws, [
          '123btcusd',
          'os',
          [
            [ -16.1, 1, 1 ],
            [ -8.99, 3, 12 ]
          ]
        ])
      }, 50)

      setTimeout(() => {
        wss.send(ws, [
          '123btcusd',
          [ 1, 1, 1 ]
        ])
      }, 100)
    }

    wss.closeHook = (ws) => {
      wss.close()
    }

    const conf = { url: 'ws://localhost:8888' }
    const ws = new MWsHive(conf)

    ws.on('open', () => {
      ws.subscribeOrderBook('BTCUSD')
    })

    ws.on('close', () => {
      assert.equal(ws.connected, false)
      done()
    })

    let count = 0
    ws.onOrderBook({ symbol: 'BTCUSD' }, (ob) => {
      if (count === 1) {
        assert.deepEqual(ob, [ 1, 1, 1 ])
        count++
      }

      if (count === 0) {
        assert.deepEqual(ob, [ [ -16.1, 1, 1 ], [ -8.99, 3, 12 ] ])
        count++
      }

      if (count === 2) {
        ws.close()
      }
    })

    ws.open()
  })
})
