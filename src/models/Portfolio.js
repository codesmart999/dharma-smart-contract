'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Investment = require('./Investment');

var _Investment2 = _interopRequireDefault(_Investment);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _Util = require('../Util');

var _Util2 = _interopRequireDefault(_Util);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Constants = require('../Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PORTFOLIO_STORE_FILE = _os2.default.homedir() + '/.dharma/portfolio.json';

var Portfolio = function () {
  function Portfolio(web3, wallet) {
    var investments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var bids = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Portfolio);

    this.web3 = web3;
    this.wallet = wallet;
    this.investments = investments;
    this.bids = bids;
  }

  _createClass(Portfolio, [{
    key: 'addBid',
    value: function addBid(bid) {
      var uuid = bid.loan.uuid;
      this.bids[uuid] = bid;
    }
  }, {
    key: 'removeBid',
    value: function removeBid(bid) {
      var uuid = bid.loan.uuid;
      delete this.bids[uuid];
    }
  }, {
    key: 'addInvestment',
    value: function addInvestment(investment) {
      var uuid = investment.loan.uuid;
      this.investments[uuid] = investment;
    }
  }, {
    key: 'getSummary',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var principalOutstanding, principalCollected, interestCollected, cash, defaulted, summary;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getTotalOutstandingPrincipal();

              case 2:
                principalOutstanding = _context.sent;
                _context.next = 5;
                return this.getTotalCollectedPrincipal();

              case 5:
                principalCollected = _context.sent;
                _context.next = 8;
                return this.getTotalCollectedInterest();

              case 8:
                interestCollected = _context.sent;
                _context.next = 11;
                return this.getTotalCash();

              case 11:
                cash = _context.sent;
                _context.next = 14;
                return this.getTotalDefaultedValue();

              case 14:
                defaulted = _context.sent;
                summary = {
                  principalOutstanding: principalOutstanding,
                  principalCollected: principalCollected,
                  interestCollected: interestCollected,
                  totalCash: cash,
                  defaultedValue: defaulted
                };
                return _context.abrupt('return', summary);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getSummary() {
        return _ref.apply(this, arguments);
      }

      return getSummary;
    }()
  }, {
    key: 'getTotalCash',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Util2.default.getBalance(this.web3, this.wallet.getAddress());

              case 2:
                return _context2.abrupt('return', _context2.sent);

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTotalCash() {
        return _ref2.apply(this, arguments);
      }

      return getTotalCash;
    }()
  }, {
    key: 'getTotalValue',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
        var loans, promises, amountsRepaid, totalValue;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                loans = this.getLoans();
                promises = loans.map(function (loan) {
                  return new Promise(function () {
                    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(resolve, reject) {
                      var balanceRepaid;
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _context3.next = 2;
                              return loan.amountRepaid();

                            case 2:
                              balanceRepaid = _context3.sent;

                              resolve(balanceRepaid);

                            case 4:
                            case 'end':
                              return _context3.stop();
                          }
                        }
                      }, _callee3, this);
                    }));

                    return function (_x3, _x4) {
                      return _ref4.apply(this, arguments);
                    };
                  }());
                });
                _context4.next = 4;
                return Promise.all(promises);

              case 4:
                amountsRepaid = _context4.sent;
                _context4.next = 7;
                return this.getTotalCash();

              case 7:
                totalValue = _context4.sent;

                amountsRepaid.forEach(function (amount) {
                  totalValue = totalValue.plus(amount);
                });

                return _context4.abrupt('return', totalValue);

              case 10:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTotalValue() {
        return _ref3.apply(this, arguments);
      }

      return getTotalValue;
    }()
  }, {
    key: 'getInvestments',
    value: function getInvestments() {
      var _this = this;

      var currentInvestments = _lodash2.default.filter(Object.keys(this.investments), function (uuid) {
        var investment = _this.investments[uuid];
        var balance = new _bignumber2.default(investment.balance);
        if (balance.gt(0)) {
          return true;
        }
      });

      return _lodash2.default.map(currentInvestments, function (uuid) {
        return _this.investments[uuid];
      });
    }
  }, {
    key: 'getInvestmentsOutstanding',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var investments, outstandingInvestments, i, investment, status;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                investments = this.getInvestments();
                outstandingInvestments = [];
                i = 0;

              case 3:
                if (!(i < investments.length)) {
                  _context5.next = 12;
                  break;
                }

                investment = investments[i];
                _context5.next = 7;
                return investment.loan.servicing.getRepaymentStatus();

              case 7:
                status = _context5.sent;

                if (status !== 'REPAID') {
                  outstandingInvestments.push(investment);
                }

              case 9:
                i++;
                _context5.next = 3;
                break;

              case 12:
                return _context5.abrupt('return', outstandingInvestments);

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getInvestmentsOutstanding() {
        return _ref5.apply(this, arguments);
      }

      return getInvestmentsOutstanding;
    }()
  }, {
    key: 'getTotalPrincipal',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var investmentsOutstanding, totalPrincipal, i, investment;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.getInvestmentsOutstanding();

              case 2:
                investmentsOutstanding = _context6.sent;
                totalPrincipal = new _bignumber2.default(0);

                for (i = 0; i < investmentsOutstanding.length; i++) {
                  investment = investmentsOutstanding[i];

                  totalPrincipal = totalPrincipal.plus(investment.balance);
                }

                return _context6.abrupt('return', totalPrincipal);

              case 6:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getTotalPrincipal() {
        return _ref6.apply(this, arguments);
      }

      return getTotalPrincipal;
    }()
  }, {
    key: 'getTotalCollectedPrincipal',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
        var investmentsOutstanding, totalCollectedPrincipal, i, investment, _loan, totalPrincipalRepaid, investorsPrincipalRepaid;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.getInvestmentsOutstanding();

              case 2:
                investmentsOutstanding = _context7.sent;
                totalCollectedPrincipal = new _bignumber2.default(0);
                i = 0;

              case 5:
                if (!(i < investmentsOutstanding.length)) {
                  _context7.next = 16;
                  break;
                }

                investment = investmentsOutstanding[i];
                _loan = investment.loan;
                _context7.next = 10;
                return _loan.servicing.getPrincipalRepaidToDate();

              case 10:
                totalPrincipalRepaid = _context7.sent;
                investorsPrincipalRepaid = totalPrincipalRepaid.div(_loan.principal).times(investment.balance);

                totalCollectedPrincipal = totalCollectedPrincipal.plus(investorsPrincipalRepaid);

              case 13:
                i++;
                _context7.next = 5;
                break;

              case 16:
                return _context7.abrupt('return', totalCollectedPrincipal);

              case 17:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getTotalCollectedPrincipal() {
        return _ref7.apply(this, arguments);
      }

      return getTotalCollectedPrincipal;
    }()
  }, {
    key: 'getTotalCollectedInterest',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
        var investmentsOutstanding, totalCollectedInterest, i, investment, _loan2, interestEarned, investorsInterestCollected;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getInvestmentsOutstanding();

              case 2:
                investmentsOutstanding = _context8.sent;
                totalCollectedInterest = new _bignumber2.default(0);
                i = 0;

              case 5:
                if (!(i < investmentsOutstanding.length)) {
                  _context8.next = 16;
                  break;
                }

                investment = investmentsOutstanding[i];
                _loan2 = investment.loan;
                _context8.next = 10;
                return _loan2.servicing.getInterestRepaidToDate();

              case 10:
                interestEarned = _context8.sent;
                investorsInterestCollected = interestEarned.div(_loan2.principal).times(investment.balance);

                totalCollectedInterest = totalCollectedInterest.plus(investorsInterestCollected);

              case 13:
                i++;
                _context8.next = 5;
                break;

              case 16:
                return _context8.abrupt('return', totalCollectedInterest);

              case 17:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getTotalCollectedInterest() {
        return _ref8.apply(this, arguments);
      }

      return getTotalCollectedInterest;
    }()
  }, {
    key: 'getTotalOutstandingPrincipal',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
        var totalPrincipal, totalCollectedPrincipal;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getTotalPrincipal();

              case 2:
                totalPrincipal = _context9.sent;
                _context9.next = 5;
                return this.getTotalCollectedPrincipal();

              case 5:
                totalCollectedPrincipal = _context9.sent;
                return _context9.abrupt('return', totalPrincipal.minus(totalCollectedPrincipal));

              case 7:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getTotalOutstandingPrincipal() {
        return _ref9.apply(this, arguments);
      }

      return getTotalOutstandingPrincipal;
    }()
  }, {
    key: 'getDelinquentInvestments',
    value: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
        var investments, delinquentInvestments, i, investment, status;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                investments = this.getInvestments();
                delinquentInvestments = [];
                i = 0;

              case 3:
                if (!(i < investments.length)) {
                  _context10.next = 12;
                  break;
                }

                investment = investments[i];
                _context10.next = 7;
                return investment.loan.servicing.getRepaymentStatus();

              case 7:
                status = _context10.sent;

                if (status === 'DELINQUENT') {
                  delinquentInvestments.push(loan);
                }

              case 9:
                i++;
                _context10.next = 3;
                break;

              case 12:
                return _context10.abrupt('return', delinquentInvestments);

              case 13:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getDelinquentInvestments() {
        return _ref10.apply(this, arguments);
      }

      return getDelinquentInvestments;
    }()
  }, {
    key: 'getDefaultedInvestments',
    value: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
        var investments, defaultedInvestments, i, investment, status;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                investments = this.getInvestments();
                defaultedInvestments = [];
                i = 0;

              case 3:
                if (!(i < investments.length)) {
                  _context11.next = 12;
                  break;
                }

                investment = investments[i];
                _context11.next = 7;
                return investment.loan.servicing.getRepaymentStatus();

              case 7:
                status = _context11.sent;

                if (status === 'DEFAULT') {
                  defaultedInvestments.push(loan);
                }

              case 9:
                i++;
                _context11.next = 3;
                break;

              case 12:
                return _context11.abrupt('return', defaultedInvestments);

              case 13:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getDefaultedInvestments() {
        return _ref11.apply(this, arguments);
      }

      return getDefaultedInvestments;
    }()
  }, {
    key: 'getTotalDefaultedValue',
    value: function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
        var defaultedInvestments, totalValue, i, investment, _loan3, totalRepaid, totalDefaulted, totalDefaultedFromInvestor;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.getDefaultedInvestments();

              case 2:
                defaultedInvestments = _context12.sent;
                totalValue = new _bignumber2.default(0);
                i = 0;

              case 5:
                if (!(i < defaultedInvestments.length)) {
                  _context12.next = 17;
                  break;
                }

                investment = defaultedInvestments[i];
                _loan3 = investment.loan;
                _context12.next = 10;
                return _loan3.amountRepaid();

              case 10:
                totalRepaid = _context12.sent;
                totalDefaulted = _loan3.principal.minus(totalRepaid);
                totalDefaultedFromInvestor = totalDefaulted.times(investment.balance).div(_loan3.principal);

                totalValue = totalValue.plus(totalDefaultedFromInvestor);

              case 14:
                i++;
                _context12.next = 5;
                break;

              case 17:
                return _context12.abrupt('return', totalValue);

              case 18:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getTotalDefaultedValue() {
        return _ref12.apply(this, arguments);
      }

      return getTotalDefaultedValue;
    }()
  }, {
    key: 'getTotalInterestCollected',
    value: function () {
      var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
        var investments, totalInterest, i, investment, _loan4, interest, interestToInvestor;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                investments = this.getInvestments();
                totalInterest = new _bignumber2.default(0);
                i = 0;

              case 3:
                if (!(i < investments.length)) {
                  _context13.next = 14;
                  break;
                }

                investment = investments[i];
                _loan4 = investment.loan;
                _context13.next = 8;
                return _loan4.servicing.getInterestRepaidToDate(new Date());

              case 8:
                interest = _context13.sent;
                interestToInvestor = interest.times(investment.balance).div(_loan4.principal);

                totalInterest = totalInterest.add(interestToInvestor);

              case 11:
                i++;
                _context13.next = 3;
                break;

              case 14:
                return _context13.abrupt('return', totalInterest);

              case 15:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getTotalInterestCollected() {
        return _ref13.apply(this, arguments);
      }

      return getTotalInterestCollected;
    }()
  }, {
    key: 'toJson',
    value: function toJson() {
      var raw = {
        investments: {},
        bids: {}
      };

      Object.keys(this.investments).forEach(function (uuid) {
        raw.investments[uuid] = this.investments[uuid].toJson();
      }.bind(this));

      Object.keys(this.bids).forEach(function (uuid) {
        raw.bids[uuid] = this.bids[uuid].toJson();
      }.bind(this));

      return raw;
    }
  }, {
    key: 'save',
    value: function () {
      var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
        var raw;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                raw = this.toJson();
                _context14.next = 3;
                return _fsExtra2.default.outputJson(PORTFOLIO_STORE_FILE, raw);

              case 3:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function save() {
        return _ref14.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'getInvestment',
    value: function getInvestment(uuid) {
      return this.investments[uuid];
    }
  }, {
    key: 'stopWatchingEvents',
    value: function () {
      var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
        var uuid, investment, _uuid, bid;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.t0 = regeneratorRuntime.keys(this.investments);

              case 1:
                if ((_context15.t1 = _context15.t0()).done) {
                  _context15.next = 8;
                  break;
                }

                uuid = _context15.t1.value;
                investment = this.investments[uuid];
                _context15.next = 6;
                return investment.stopWatchingEvents();

              case 6:
                _context15.next = 1;
                break;

              case 8:
                _context15.t2 = regeneratorRuntime.keys(this.bids);

              case 9:
                if ((_context15.t3 = _context15.t2()).done) {
                  _context15.next = 16;
                  break;
                }

                _uuid = _context15.t3.value;
                bid = this.bids[_uuid];
                _context15.next = 14;
                return bid.stopWatchingEvents();

              case 14:
                _context15.next = 9;
                break;

              case 16:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function stopWatchingEvents() {
        return _ref15.apply(this, arguments);
      }

      return stopWatchingEvents;
    }()
  }], [{
    key: 'load',
    value: function () {
      var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(dharma, wallet) {
        var raw, investments, bids, loadInvestmentPromises, loadBidPromises, promises;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                raw = void 0;
                _context18.prev = 1;
                _context18.next = 4;
                return _fsExtra2.default.readJson(PORTFOLIO_STORE_FILE);

              case 4:
                raw = _context18.sent;
                _context18.next = 10;
                break;

              case 7:
                _context18.prev = 7;
                _context18.t0 = _context18['catch'](1);
                throw new Error('Portfolio store file does not exist.');

              case 10:
                investments = {};
                bids = {};
                loadInvestmentPromises = Object.keys(raw.investments).map(function () {
                  var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(uuid) {
                    return regeneratorRuntime.wrap(function _callee16$(_context16) {
                      while (1) {
                        switch (_context16.prev = _context16.next) {
                          case 0:
                            _context16.next = 2;
                            return _Investment2.default.fromJson(raw.investments[uuid], dharma);

                          case 2:
                            investments[uuid] = _context16.sent;

                          case 3:
                          case 'end':
                            return _context16.stop();
                        }
                      }
                    }, _callee16, this);
                  }));

                  return function (_x7) {
                    return _ref17.apply(this, arguments);
                  };
                }().bind(this));
                loadBidPromises = Object.keys(raw.bids).map(function () {
                  var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(uuid) {
                    return regeneratorRuntime.wrap(function _callee17$(_context17) {
                      while (1) {
                        switch (_context17.prev = _context17.next) {
                          case 0:
                            _context17.next = 2;
                            return Bid.fromJson(raw.bids[uuid], dharma);

                          case 2:
                            bids[uuid] = _context17.sent;

                          case 3:
                          case 'end':
                            return _context17.stop();
                        }
                      }
                    }, _callee17, this);
                  }));

                  return function (_x8) {
                    return _ref18.apply(this, arguments);
                  };
                }().bind(this));
                promises = [].concat(_toConsumableArray(loadInvestmentPromises), _toConsumableArray(loadBidPromises));
                _context18.next = 17;
                return Promise.all(promises);

              case 17:
                return _context18.abrupt('return', new Portfolio(dharma.web3, wallet, investments, bids));

              case 18:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[1, 7]]);
      }));

      function load(_x5, _x6) {
        return _ref16.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return Portfolio;
}();

module.exports = Portfolio;