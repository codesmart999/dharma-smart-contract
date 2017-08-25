'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BidSchema = require('./schemas/BidSchema');

var _BidSchema2 = _interopRequireDefault(_BidSchema);

var _Constants = require('./Constants');

var _Portfolio = require('./models/Portfolio');

var _Portfolio2 = _interopRequireDefault(_Portfolio);

var _Investment = require('./models/Investment');

var _Investment2 = _interopRequireDefault(_Investment);

var _Bid = require('./models/Bid');

var _Bid2 = _interopRequireDefault(_Bid);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _babelCore = require('babel-core');

var _actions = require('./actions/actions');

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _BidDecorator = require('./decorators/BidDecorator');

var _BidDecorator2 = _interopRequireDefault(_BidDecorator);

var _InvestmentDecorator = require('./decorators/InvestmentDecorator');

var _InvestmentDecorator2 = _interopRequireDefault(_InvestmentDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

process.on('unhandledRejection', function (err) {
  console.log(err);
});

var Investor = function () {
  function Investor(dharma, wallet, DecisionEngine) {
    _classCallCheck(this, Investor);

    this.dharma = dharma;
    this.web3 = dharma.web3;
    this.wallet = wallet;
    this.decisionEngine = new DecisionEngine(dharma.web3);
    this.store = null;
    this.scheduledJobs = [];

    this.refreshBid = this.refreshBid.bind(this);
    this.refreshInvestment = this.refreshInvestment.bind(this);
    this.refreshBidPromise = this.refreshBidPromise.bind(this);
    this.refreshInvestmentPromise = this.refreshInvestmentPromise.bind(this);

    this.loanCreatedListenerCallback = this.loanCreatedListenerCallback.bind(this);
    this.totalCashListenerCallback = this.totalCashListenerCallback.bind(this);
  }

  _createClass(Investor, [{
    key: 'startDaemon',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(store) {
        var dharma, decisionEngine, initialStateAction, bidRefreshPromises, investmentRefereshPromises, refreshPromises;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dharma = this.dharma;
                decisionEngine = this.decisionEngine;


                this.store = store;

                process.on('uncaughtException', function (err) {
                  this.store.dispatch((0, _actions.log)('error', err.toString()));
                });

                this.store.dispatch((0, _actions.log)('info', "Loading portfolio..."));

                _context.prev = 5;
                _context.next = 8;
                return this.loadPortfolio();

              case 8:
                this.portfolio = _context.sent;
                _context.next = 16;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](5);

                this.store.dispatch((0, _actions.log)('info', "No portfolio found on disk."));
                this.store.dispatch((0, _actions.log)('info', "Creating portfolio..."));
                this.portfolio = new _Portfolio2.default(store, this.dharma.web3);

              case 16:

                this.store.dispatch((0, _actions.log)('success', 'Portfolio loaded.'));

                _context.next = 19;
                return (0, _actions.initState)(this.portfolio);

              case 19:
                initialStateAction = _context.sent;

                this.store.dispatch(initialStateAction);

                this.store.dispatch((0, _actions.log)('info', "Starting daemon..."));
                this.store.dispatch((0, _actions.log)('info', "Listening for new loan requests..."));

                _context.next = 25;
                return this.dharma.loans.events.created();

              case 25:
                this.createdEvent = _context.sent;

                this.createdEvent.watch(this.loanCreatedListenerCallback);

                this.totalCashListener = this.web3.eth.filter('latest');
                this.totalCashListener.watch(this.totalCashListenerCallback);

                bidRefreshPromises = Object.keys(this.portfolio.bids).map(this.refreshBidPromise);
                investmentRefereshPromises = Object.keys(this.portfolio.investments).map(this.refreshInvestmentPromise);
                refreshPromises = [].concat(_toConsumableArray(bidRefreshPromises), _toConsumableArray(investmentRefereshPromises));
                _context.next = 34;
                return Promise.all(refreshPromises);

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 11]]);
      }));

      function startDaemon(_x) {
        return _ref.apply(this, arguments);
      }

      return startDaemon;
    }()
  }, {
    key: 'stopDaemon',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.stopRepaymentDateJobs();

                _context2.next = 3;
                return this.portfolio.stopWatchingEvents();

              case 3:
                _context2.next = 5;
                return this.savePortfolio();

              case 5:

                this.createdEvent.stopWatching(function () {});
                this.totalCashListener.stopWatching(function () {});

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function stopDaemon() {
        return _ref2.apply(this, arguments);
      }

      return stopDaemon;
    }()
  }, {
    key: 'loanCreatedListenerCallback',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(err, result) {
        var loan, bidDecision, schema, bid, bidDecorator;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.dharma.loans.get(result.args.uuid);

              case 2:
                loan = _context3.sent;


                this.store.dispatch((0, _actions.log)('info', "Evaluating loan: " + loan.uuid));

                _context3.next = 6;
                return this.decisionEngine.decide(loan);

              case 6:
                bidDecision = _context3.sent;

                if (!bidDecision) {
                  _context3.next = 27;
                  break;
                }

                bidDecision.bidder = this.wallet.getAddress();
                schema = new _BidSchema2.default(this.dharma.web3);
                bid = void 0;
                _context3.prev = 11;

                schema.validate(bidDecision);
                bid = new _Bid2.default(loan, bidDecision.bidder, bidDecision.amount, bidDecision.minInterestRate);

                _context3.next = 16;
                return loan.bid(bid.amount, bid.bidder, bid.minInterestRate);

              case 16:
                _context3.next = 22;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](11);

                this.store.dispatch((0, _actions.log)('error', _context3.t0.toString()));
                return _context3.abrupt('return');

              case 22:
                bidDecorator = new _BidDecorator2.default(bid);

                this.store.dispatch((0, _actions.log)('info', "Bidding " + bidDecorator.amount() + " on loan " + loan.uuid + " minimum interest rate of " + bidDecorator.minInterestRate()));

                this.portfolio.addBid(bid);
                _context3.next = 27;
                return this.refreshBid(loan.uuid);

              case 27:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[11, 18]]);
      }));

      function loanCreatedListenerCallback(_x2, _x3) {
        return _ref3.apply(this, arguments);
      }

      return loanCreatedListenerCallback;
    }()
  }, {
    key: 'refreshBid',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(uuid) {
        var bid;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                bid = this.portfolio.bids[uuid];
                _context4.t0 = bid.loan.state;
                _context4.next = _context4.t0 === _Constants.AUCTION_STATE ? 4 : _context4.t0 === _Constants.REVIEW_STATE ? 7 : _context4.t0 === _Constants.ACCEPTED_STATE ? 10 : _context4.t0 === _Constants.REJECTED_STATE ? 13 : 16;
                break;

              case 4:
                _context4.next = 6;
                return this.setupAuctionStateListeners(bid);

              case 6:
                return _context4.abrupt('break', 16);

              case 7:
                _context4.next = 9;
                return this.setupReviewStateListeners(bid);

              case 9:
                return _context4.abrupt('break', 16);

              case 10:
                _context4.next = 12;
                return this.setupAcceptedState(bid);

              case 12:
                return _context4.abrupt('break', 16);

              case 13:
                _context4.next = 15;
                return this.refreshRejectedState(bid);

              case 15:
                return _context4.abrupt('break', 16);

              case 16:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function refreshBid(_x4) {
        return _ref4.apply(this, arguments);
      }

      return refreshBid;
    }()
  }, {
    key: 'refreshBidPromise',
    value: function refreshBidPromise(uuid) {
      var _this = this;

      var callback = function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _this.refreshBid(uuid);

                case 2:
                  resolve();

                case 3:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, _this);
        }));

        return function callback(_x5, _x6) {
          return _ref5.apply(this, arguments);
        };
      }();

      return new Promise(callback.bind(this));
    }
  }, {
    key: 'refreshInvestment',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(uuid) {
        var investment, loan, refundWithdrawn, repaymentEvent;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                investment = this.portfolio.investments[uuid];
                loan = investment.loan;
                _context6.next = 4;
                return loan.isRefundWithdrawn(investment.investor);

              case 4:
                refundWithdrawn = _context6.sent;

                if (refundWithdrawn) {
                  _context6.next = 15;
                  break;
                }

                this.store.dispatch((0, _actions.log)('info', 'Withdrawing refunded remainder of bid amount'));
                _context6.prev = 7;
                _context6.next = 10;
                return loan.withdrawInvestment({ from: investment.investor });

              case 10:
                _context6.next = 15;
                break;

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6['catch'](7);

                this.store.dispatch((0, _actions.log)('error', _context6.t0.toString()));

              case 15:
                _context6.next = 17;
                return this.redeemValueIfPossible(uuid);

              case 17:
                _context6.next = 19;
                return loan.events.repayment();

              case 19:
                repaymentEvent = _context6.sent;

                repaymentEvent.watch(this.repaymentCallback(loan.uuid));
                investment.addEvent('repaymentEvent', repaymentEvent);

                this.setupRepaymentDateJobs(investment);

              case 23:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[7, 12]]);
      }));

      function refreshInvestment(_x7) {
        return _ref6.apply(this, arguments);
      }

      return refreshInvestment;
    }()
  }, {
    key: 'refreshInvestmentPromise',
    value: function refreshInvestmentPromise(uuid) {
      var _this2 = this;

      var callback = function () {
        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return _this2.refreshInvestment(uuid);

                case 2:
                  resolve();

                case 3:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, _this2);
        }));

        return function callback(_x8, _x9) {
          return _ref7.apply(this, arguments);
        };
      }();

      return new Promise(callback.bind(this));
    }
  }, {
    key: 'redeemValueIfPossible',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(uuid) {
        var investment, loan, redeemableValue, portfolioSummary;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                investment = this.portfolio.investments[uuid];
                loan = investment.loan;
                _context8.next = 4;
                return loan.getRedeemableValue(this.wallet.getAddress());

              case 4:
                redeemableValue = _context8.sent;

                if (!redeemableValue.gt(0)) {
                  _context8.next = 12;
                  break;
                }

                _context8.next = 8;
                return this.collect(uuid);

              case 8:
                _context8.next = 10;
                return this.portfolio.getSummary();

              case 10:
                portfolioSummary = _context8.sent;

                this.store.dispatch((0, _actions.updatePortfolioSummary)(portfolioSummary));

              case 12:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function redeemValueIfPossible(_x10) {
        return _ref8.apply(this, arguments);
      }

      return redeemValueIfPossible;
    }()
  }, {
    key: 'setupAuctionStateListeners',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(bid) {
        var loan, auctionCompletedEvent;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                loan = bid.loan;
                _context9.next = 3;
                return loan.events.auctionCompleted();

              case 3:
                auctionCompletedEvent = _context9.sent;

                auctionCompletedEvent.watch(function () {
                  this.auctionCompletedCallback(loan.uuid)();
                }.bind(this));

                bid.addEvent('auctionCompletedEvent', auctionCompletedEvent);

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function setupAuctionStateListeners(_x11) {
        return _ref9.apply(this, arguments);
      }

      return setupAuctionStateListeners;
    }()
  }, {
    key: 'setupReviewStateListeners',
    value: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(bid) {
        var loan, termBeginEvent, bidsRejectedEvent, bidsIgnoredEvent;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                loan = bid.loan;
                _context10.next = 3;
                return loan.events.termBegin();

              case 3:
                termBeginEvent = _context10.sent;
                _context10.next = 6;
                return loan.events.bidsRejected();

              case 6:
                bidsRejectedEvent = _context10.sent;
                _context10.next = 9;
                return loan.events.reviewPeriodCompleted();

              case 9:
                bidsIgnoredEvent = _context10.sent;


                termBeginEvent.watch(this.reviewPeriodEndedCallback(loan.uuid));
                bidsRejectedEvent.watch(this.reviewPeriodEndedCallback(loan.uuid));
                bidsIgnoredEvent.watch(this.reviewPeriodEndedCallback(loan.uuid));

                bid.addEvent('termBeginEvent', termBeginEvent);
                bid.addEvent('bidsRejectedEvent', bidsRejectedEvent);
                bid.addEvent('bidsIgnoredEvent', bidsIgnoredEvent);

              case 16:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function setupReviewStateListeners(_x12) {
        return _ref10.apply(this, arguments);
      }

      return setupReviewStateListeners;
    }()
  }, {
    key: 'setupAcceptedState',
    value: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(bid) {
        var loan, tokenBalance, investment, investmentDecorator, portfolioSummary;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                loan = bid.loan;
                _context11.next = 3;
                return loan.balanceOf(bid.bidder);

              case 3:
                tokenBalance = _context11.sent;


                if (tokenBalance.equals(0)) this.store.dispatch((0, _actions.log)('info', 'Lost auction for loan ' + loan.uuid));

                if (!tokenBalance.lt(bid.amount)) {
                  _context11.next = 15;
                  break;
                }

                this.store.dispatch((0, _actions.log)('info', 'Withdrawing refunded remainder of bid amount'));
                _context11.prev = 7;
                _context11.next = 10;
                return loan.withdrawInvestment({ from: bid.bidder });

              case 10:
                _context11.next = 15;
                break;

              case 12:
                _context11.prev = 12;
                _context11.t0 = _context11['catch'](7);

                this.store.dispatch((0, _actions.log)('error', _context11.t0.toString()));

              case 15:
                if (!tokenBalance.gt(0)) {
                  _context11.next = 31;
                  break;
                }

                investment = new _Investment2.default(loan);

                investment.investor = bid.bidder;
                _context11.next = 20;
                return loan.servicing.getRepaymentStatus();

              case 20:
                investment.repaymentStatus = _context11.sent;

                investment.balance = tokenBalance;
                _context11.next = 24;
                return loan.amountRepaid();

              case 24:
                investment.amountRepaid = _context11.sent;
                investmentDecorator = new _InvestmentDecorator2.default(investment);

                this.store.dispatch((0, _actions.log)('success', 'Won auction for ' + investmentDecorator.balance() + ' tokens in loan ' + loan.uuid + 'at a ' + investmentDecorator.interestRate() + ' interest rate.'));

                this.portfolio.addInvestment(investment);
                _context11.next = 30;
                return this.refreshInvestment(loan.uuid);

              case 30:

                this.store.dispatch((0, _actions.addInvestment)(investment));

              case 31:

                this.portfolio.removeBid(bid);

                _context11.next = 34;
                return this.portfolio.getSummary();

              case 34:
                portfolioSummary = _context11.sent;

                this.store.dispatch((0, _actions.updatePortfolioSummary)(portfolioSummary));

              case 36:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[7, 12]]);
      }));

      function setupAcceptedState(_x13) {
        return _ref11.apply(this, arguments);
      }

      return setupAcceptedState;
    }()
  }, {
    key: 'refreshRejectedState',
    value: function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(bid) {
        var refundWithdrawn;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                this.store.dispatch((0, _actions.log)('info', 'Bid for loan ' + bid.loan.uuid + 'rejected.'));
                _context12.next = 3;
                return bid.loan.isRefundWithdrawn(bid.bidder);

              case 3:
                refundWithdrawn = _context12.sent;

                if (refundWithdrawn) {
                  _context12.next = 14;
                  break;
                }

                this.store.dispatch((0, _actions.log)('info', 'Withdrawing refunded bid amount.'));
                _context12.prev = 6;
                _context12.next = 9;
                return bid.loan.withdrawInvestment({ from: bid.bidder });

              case 9:
                _context12.next = 14;
                break;

              case 11:
                _context12.prev = 11;
                _context12.t0 = _context12['catch'](6);

                this.store.dispatch((0, _actions.log)('error', _context12.t0.toString()));

              case 14:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[6, 11]]);
      }));

      function refreshRejectedState(_x14) {
        return _ref12.apply(this, arguments);
      }

      return refreshRejectedState;
    }()
  }, {
    key: 'auctionCompletedCallback',
    value: function auctionCompletedCallback(uuid) {
      var _this3 = this;

      var callback = function () {
        var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(err, result) {
          var bid;
          return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
              switch (_context13.prev = _context13.next) {
                case 0:
                  bid = _this3.portfolio.bids[uuid];

                  bid.events['auctionCompletedEvent'].stopWatching(function () {
                    // do something
                  });
                  _this3.store.dispatch((0, _actions.log)('info', 'Auction completed for loan ' + uuid));
                  _context13.next = 5;
                  return _this3.refreshBid(uuid);

                case 5:
                case 'end':
                  return _context13.stop();
              }
            }
          }, _callee13, _this3);
        }));

        return function callback(_x15, _x16) {
          return _ref13.apply(this, arguments);
        };
      }();

      return callback.bind(this);
    }
  }, {
    key: 'reviewPeriodEndedCallback',
    value: function reviewPeriodEndedCallback(uuid) {
      var _this4 = this;

      var callback = function () {
        var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(err, result) {
          var bid;
          return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  bid = _this4.portfolio.bids[uuid];

                  bid.events['termBeginEvent'].stopWatching(function () {});
                  bid.events['bidsRejectedEvent'].stopWatching(function () {});
                  bid.events['bidsIgnoredEvent'].stopWatching(function () {});
                  _context14.next = 6;
                  return _this4.refreshBid(uuid);

                case 6:
                case 'end':
                  return _context14.stop();
              }
            }
          }, _callee14, _this4);
        }));

        return function callback(_x17, _x18) {
          return _ref14.apply(this, arguments);
        };
      }();

      return callback.bind(this);
    }
  }, {
    key: 'repaymentCallback',
    value: function repaymentCallback(uuid) {
      var _this5 = this;

      var callback = function () {
        var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(err, result) {
          var investment, amountRepaid;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  investment = _this5.portfolio.investments[uuid];
                  _context15.next = 3;
                  return investment.loan.amountRepaid();

                case 3:
                  amountRepaid = _context15.sent;

                  investment.amountRepaid = amountRepaid;
                  if (amountRepaid.gte(investment.loan.servicing.totalOwed())) investment.events['repaymentEvent'].stopWatching(function () {});

                  _this5.store.dispatch((0, _actions.updateInvestment)(investment));
                  _this5.store.dispatch((0, _actions.log)('success', 'Received repayment of ' + _InvestmentDecorator2.default.individualRepayment(result.args.value) + ' for loan ' + uuid));

                  _this5.store.dispatch((0, _actions.log)('info', 'Collecting repayment from loan contract ' + uuid));
                  _context15.next = 11;
                  return _this5.redeemValueIfPossible(uuid);

                case 11:
                case 'end':
                  return _context15.stop();
              }
            }
          }, _callee15, _this5);
        }));

        return function callback(_x19, _x20) {
          return _ref15.apply(this, arguments);
        };
      }();

      return callback.bind(this);
    }
  }, {
    key: 'totalCashListenerCallback',
    value: function () {
      var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(err, block) {
        var totalCash;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.portfolio.getTotalCash();

              case 2:
                totalCash = _context16.sent;

                this.store.dispatch((0, _actions.updateTotalCash)(totalCash));

              case 4:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function totalCashListenerCallback(_x21, _x22) {
        return _ref16.apply(this, arguments);
      }

      return totalCashListenerCallback;
    }()
  }, {
    key: 'setupRepaymentDateJobs',
    value: function setupRepaymentDateJobs(investment) {
      var repaymentDates = investment.loan.servicing.getRepaymentDates();
      for (var i = 0; i < repaymentDates.length; i++) {
        var date = repaymentDates[i];
        var job = _nodeSchedule2.default.scheduleJob(date, this.repaymentDateCallback(investment));
        this.scheduledJobs.push(job);
      }
    }
  }, {
    key: 'repaymentDateCallback',
    value: function repaymentDateCallback(investment) {
      var _this6 = this;

      var callback = function () {
        var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17() {
          var repaymentStatus;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return investment.loan.servicing.getRepaymentStatus();

                case 2:
                  repaymentStatus = _context17.sent;

                  investment.repaymentStatus = repaymentStatus;

                  _this6.store.dispatch((0, _actions.updateInvestment)(investment));

                case 5:
                case 'end':
                  return _context17.stop();
              }
            }
          }, _callee17, _this6);
        }));

        return function callback() {
          return _ref17.apply(this, arguments);
        };
      }();

      return callback.bind(this);
    }
  }, {
    key: 'stopRepaymentDateJobs',
    value: function stopRepaymentDateJobs() {
      this.scheduledJobs.forEach(function (job) {
        job.cancel();
      });
      this.scheduledJobs = [];
    }
  }, {
    key: 'loadPortfolio',
    value: function () {
      var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18() {
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                _context18.next = 3;
                return _Portfolio2.default.load(this.dharma, this.wallet);

              case 3:
                this.portfolio = _context18.sent;
                _context18.next = 9;
                break;

              case 6:
                _context18.prev = 6;
                _context18.t0 = _context18['catch'](0);

                this.portfolio = new _Portfolio2.default(this.dharma.web3, this.wallet);

              case 9:
                return _context18.abrupt('return', this.portfolio);

              case 10:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[0, 6]]);
      }));

      function loadPortfolio() {
        return _ref18.apply(this, arguments);
      }

      return loadPortfolio;
    }()
  }, {
    key: 'savePortfolio',
    value: function () {
      var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19() {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.portfolio.save();

              case 2:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function savePortfolio() {
        return _ref19.apply(this, arguments);
      }

      return savePortfolio;
    }()
  }, {
    key: 'collect',
    value: function () {
      var _ref20 = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(uuid) {
        var investment;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                investment = this.portfolio.investments[uuid];

                this.store.dispatch((0, _actions.log)('info', 'Redeeming repaid value from loan ' + uuid));
                _context20.prev = 2;
                _context20.next = 5;
                return investment.loan.redeemValue(investment.investor);

              case 5:
                _context20.next = 10;
                break;

              case 7:
                _context20.prev = 7;
                _context20.t0 = _context20['catch'](2);

                this.store.dispatch((0, _actions.log)('error', _context20.t0.toString()));

              case 10:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[2, 7]]);
      }));

      function collect(_x23) {
        return _ref20.apply(this, arguments);
      }

      return collect;
    }()
  }], [{
    key: 'fromPath',
    value: function () {
      var _ref21 = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(dharma, wallet, engineFilePath) {
        var path, _transformFileSync, code, decisionEngine;

        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;
                path = process.cwd() + '/' + engineFilePath;
                _transformFileSync = (0, _babelCore.transformFileSync)(path), code = _transformFileSync.code;
                decisionEngine = Investor._requireFromString(code, path);
                return _context21.abrupt('return', new Investor(dharma, wallet, decisionEngine));

              case 7:
                _context21.prev = 7;
                _context21.t0 = _context21['catch'](0);

                console.log(_context21.t0);
                throw new Error("Decision engine file not found.");

              case 11:
              case 'end':
                return _context21.stop();
            }
          }
        }, _callee21, this, [[0, 7]]);
      }));

      function fromPath(_x24, _x25, _x26) {
        return _ref21.apply(this, arguments);
      }

      return fromPath;
    }()
  }, {
    key: '_requireFromString',
    value: function _requireFromString(src, filename) {
      var Module = module.constructor;
      var m = new Module();
      m._compile(src, filename);
      return m.exports;
    }
  }]);

  return Investor;
}();

module.exports = Investor;