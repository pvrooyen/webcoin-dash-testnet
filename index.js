var extend = require('webcoin-bitcoin')

// inherit from bitcoin mainnet params
module.exports = extend({
  blockchain: require('./src/blockchain.js'),
  net: require('./src/net.js'),
  wallet: require('./src/wallet.js')
})
