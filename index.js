var extend = require('webcoin-dash')

// inherit from bitcoin mainnet params
module.exports = extend({
  blockchain: require('./lib/blockchain.js'),
  net: require('./lib/net.js'),
  wallet: require('./lib/wallet.js'),
  versionbits: require('./lib/versionbits.js')
})
