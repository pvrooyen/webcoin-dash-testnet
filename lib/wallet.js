'use strict';

module.exports = {
  messagePrefix: '\x18Dash Signed Message:\n',
  bip32: {
    public: 0x3a8061a0,
    private: 0x3a805837
  },
  pubKeyHash: 0x8c,
  scriptHash: 0x13,
  wif: 0x80, // TODO not sure if this is right
  dustThreshold: 546
};