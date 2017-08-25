'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = require('../Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Investment = function () {
  function Investment(loan) {
    _classCallCheck(this, Investment);

    this.loan = loan;
    this.investor = null;
    this.events = {};
    this.balance = new _bignumber2.default(0);
    this.amountRepaid = new _bignumber2.default(0);
    this.repaymentStatus = null;
  }

  _createClass(Investment, [{
    key: 'addEvent',
    value: function addEvent(eventName, event) {
      this.events[eventName] = event;
    }
  }, {
    key: 'getEvent',
    value: function getEvent(eventName) {
      return this.events[eventName];
    }
  }, {
    key: 'stopWatchingEvents',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var _loop, eventName;

        return regeneratorRuntime.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _loop = regeneratorRuntime.mark(function _loop(eventName) {
                  var event;
                  return regeneratorRuntime.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          event = _this.events[eventName];
                          _context.next = 3;
                          return new Promise(function (resolve, reject) {
                            event.stopWatching(function () {
                              resolve();
                            });
                          });

                        case 3:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _loop, _this);
                });
                _context2.t0 = regeneratorRuntime.keys(this.events);

              case 2:
                if ((_context2.t1 = _context2.t0()).done) {
                  _context2.next = 7;
                  break;
                }

                eventName = _context2.t1.value;
                return _context2.delegateYield(_loop(eventName), 't2', 5);

              case 5:
                _context2.next = 2;
                break;

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function stopWatchingEvents() {
        return _ref.apply(this, arguments);
      }

      return stopWatchingEvents;
    }()
  }, {
    key: 'toJson',
    value: function toJson() {
      var json = {
        loan: this.loan.toJson(),
        balance: this.balance,
        investor: this.investor,
        termBeginDate: this.termBeginDate,
        amountRepaid: this.amountRepaid,
        repaymentStatus: this.repaymentStatus
      };

      if (this.termBeginDate) {
        json.termBeginTimestamp = this.termBeginDate.getTime();
      }

      return json;
    }
  }], [{
    key: 'fromJson',
    value: function fromJson(json, dharma) {
      return new Promise(function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resolve, reject) {
          var loan, investment;
          return regeneratorRuntime.wrap(function _callee2$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return dharma.loans.get(json.loan.uuid);

                case 2:
                  loan = _context3.sent;
                  investment = new Investment(loan);
                  _context3.next = 6;
                  return loan.getState();

                case 6:
                  investment.state = _context3.sent;

                  investment.investor = json.investor;
                  investment.balance = new _bignumber2.default(json.balance);
                  _context3.next = 11;
                  return loan.amountRepaid();

                case 11:
                  investment.amountRepaid = _context3.sent;

                  if (json.termBeginTimestamp) investment.termBeginDate = new Date(json.termBeginTimestamp);
                  _context3.next = 15;
                  return loan.servicing.getRepaymentStatus();

                case 15:
                  investment.repaymentStatus = _context3.sent;


                  resolve(investment);

                case 17:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee2, this);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }]);

  return Investment;
}();

module.exports = Investment;