'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Authenticate = require('./Authenticate');

var _Authenticate2 = _interopRequireDefault(_Authenticate);

var _Errors = require('./Errors');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _Liabilities = require('./models/Liabilities');

var _Liabilities2 = _interopRequireDefault(_Liabilities);

var _dharmaClient = require('dharma-client');

var _dharmaClient2 = _interopRequireDefault(_dharmaClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Borrower = function () {
  function Borrower(web3, authToken) {
    _classCallCheck(this, Borrower);

    var env = process.env.ENV || 'production';

    this.dharmaClient = new _dharmaClient2.default(web3, authToken, env);
  }

  _createClass(Borrower, [{
    key: 'fetchLimit',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.dharmaClient.fetchLimit();

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchLimit() {
        return _ref.apply(this, arguments);
      }

      return fetchLimit;
    }()
  }, {
    key: 'requestSignedLoan',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(address, amount) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.dharmaClient.requestSignedLoan(address, amount);

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function requestSignedLoan(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return requestSignedLoan;
    }()
  }, {
    key: 'requestDeploymentStipend',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(address) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.dharmaClient.requestDeploymentStipend(address);

              case 2:
                return _context3.abrupt('return', _context3.sent);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function requestDeploymentStipend(_x3) {
        return _ref3.apply(this, arguments);
      }

      return requestDeploymentStipend;
    }()
  }, {
    key: 'broadcastLoanRequest',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(address, amount, deployedCallback, reviewCallback) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.dharmaClient.broadcastLoanRequest(address, amount, deployedCallback, reviewCallback);

              case 2:
                return _context4.abrupt('return', _context4.sent);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function broadcastLoanRequest(_x4, _x5, _x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return broadcastLoanRequest;
    }()
  }, {
    key: 'acceptLoanTerms',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(loan, bids) {
        var liabilities;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return loan.acceptBids(bids);

              case 2:
                liabilities = void 0;
                _context5.prev = 3;
                _context5.next = 6;
                return _Liabilities2.default.load(this.dharma);

              case 6:
                liabilities = _context5.sent;
                _context5.next = 12;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5['catch'](3);

                liabilities = new _Liabilities2.default();

              case 12:

                liabilities.addLoan(loan);
                _context5.next = 15;
                return liabilities.save();

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 9]]);
      }));

      function acceptLoanTerms(_x8, _x9) {
        return _ref5.apply(this, arguments);
      }

      return acceptLoanTerms;
    }()
  }]);

  return Borrower;
}();

module.exports = Borrower;