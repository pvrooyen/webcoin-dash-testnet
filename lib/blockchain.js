'use strict';

// blockchain definition

var bitcoin = require('webcoin-bitcoin').blockchain;
var u = require('bitcoin-util');

// definition of the genesis block's header
var genesisHeader = {
  hash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
  height: 0,
  version: 1,
  prevHash: u.nullHash,
  merkleRoot: u.toHash('e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7'),
  time: 1390666206,
  bits: 0x1e0ffff0,
  nonce: 3861367235
};

// selected block headers for verifying initial sync
var checkpoints = [{
  hash: '00000bafbc94add76cb75e2ec92894837288a481e5c005f6563d91623bf8bc2c',
  height: 0,
  version: 1,
  prevHash: u.nullHash,
  merkleRoot: u.toHash('e0028eb9648db56b1ac77cf090b99048a8007e2bb64b68f092c03c7f56a662c7'),
  time: 1390666206,
  bits: 0x1e0ffff0,
  nonce: 3861367235
}];

// TODO: implement chain validation
var minDiffStart = 1329264000;

function shouldRetarget(block, cb) {
  var onInterval = block.height % this.interval === 0;
  var afterTimeoutStart = block.header.timestamp >= minDiffStart;
  return cb(null, onInterval || afterTimeoutStart);
}

function calculateTarget(block, chain, cb) {
  var _this = this;

  if (block.height % this.interval === 0) {
    return bitcoin.calculateTarget.call(this, block, chain, cb);
  }

  chain.getBlock(block.header.prevHash, function (err, prev) {
    if (err) return cb(err);

    var timeDelta = block.header.timestamp - prev.header.timestamp;
    if (timeDelta > _this.targetSpacing * 2) {
      // the network didn't find a block in time, so lower difficulty to minimum
      return cb(null, chain.maxTarget());
    }

    // the difficulty is whatever is in the last non-mindiff block
    traverseToRealDifficulty.call(_this, block, chain, function (err, prev) {
      if (err) return cb(err);
      cb(null, u.expandTarget(prev.header.bits));
    });
  });
}

// traverse to last real difficulty block (not a mindiff timeout blocks)
function traverseToRealDifficulty(block, chain, cb) {
  var _this2 = this;

  var traverse = function traverse(err, prev) {
    if (err) return cb(err);
    var onInterval = prev.height % _this2.interval === 0;
    if (onInterval || prev.header.bits !== _this2.genesisHeader.bits) {
      return cb(null, prev);
    }
    chain.getBlock(prev.header.prevHash, traverse);
  };
  chain.getBlock(block.header.prevHash, traverse);
}

module.exports = {
  genesisHeader: genesisHeader,
  checkpoints: checkpoints
};