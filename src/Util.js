'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'stripZeroEx',
    value: function stripZeroEx(data) {
      if (data.slice(0, 2) === '0x') return data.slice(2);else return data;
    }
  }, {
    key: 'transactionMined',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(web3, txHash) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', new Promise(function (resolve, reject) {
                  var filter = web3.eth.filter('latest');
                  filter.watch(function (err, block) {
                    if (err) {
                      reject(err);
                    } else {
                      web3.eth.getTransaction(txHash, function (err, tx) {
                        if (tx.blockNumber) {
                          filter.stopWatching(function () {
                            resolve(tx);
                          });
                        }
                      });;
                    }
                  });
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function transactionMined(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return transactionMined;
    }()
  }, {
    key: 'getBalance',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(web3, address) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  web3.eth.getBalance(address, function (err, balance) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(balance.div(Math.pow(10, 18)));
                    }
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getBalance(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return getBalance;
    }()
  }]);

  return Util;
}();

module.exports = Util;