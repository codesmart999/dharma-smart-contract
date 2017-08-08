'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = function () {
  function Util() {
    (0, _classCallCheck3.default)(this, Util);
  }

  (0, _createClass3.default)(Util, null, [{
    key: 'stripZeroEx',
    value: function stripZeroEx(data) {
      if (data.slice(0, 2) === '0x') return data.slice(2);else return data;
    }
  }, {
    key: 'isTestRpc',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(web3) {
        var getNodeVersion, nodeVersion;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                getNodeVersion = (0, _es6Promisify2.default)(web3.version.getNode);
                _context.next = 3;
                return getNodeVersion();

              case 3:
                nodeVersion = _context.sent;
                return _context.abrupt('return', _lodash2.default.includes(nodeVersion, 'TestRPC'));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isTestRpc(_x) {
        return _ref.apply(this, arguments);
      }

      return isTestRpc;
    }()
  }, {
    key: 'getLatestBlockNumber',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(web3) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new _promise2.default(function (accept, reject) {
                  web3.eth.getBlockNumber(function (err, blockNumber) {
                    if (err) reject(err);else {
                      accept(blockNumber);
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

      function getLatestBlockNumber(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getLatestBlockNumber;
    }()
  }, {
    key: 'getBlock',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(web3, blockNumber) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new _promise2.default(function (accept, reject) {
                  web3.eth.getBlock(blockNumber, function (err, block) {
                    if (err) reject(err);else {
                      accept(block);
                    }
                  });
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getBlock(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return getBlock;
    }()
  }, {
    key: 'padLeft',
    value: function padLeft(string, chars, sign) {
      return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
    }
  }]);
  return Util;
}();

module.exports = Util;