'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _redux = require('redux');

var _LoansOutstanding = require('./LoansOutstanding');

var _LoansOutstanding2 = _interopRequireDefault(_LoansOutstanding);

var _Terms = require('./Terms');

var _Terms2 = _interopRequireDefault(_Terms);

var _Logs = require('./Logs');

var _Logs2 = _interopRequireDefault(_Logs);

var _RiskBreakdownChart = require('./RiskBreakdownChart');

var _RiskBreakdownChart2 = _interopRequireDefault(_RiskBreakdownChart);

var _CashAvailable = require('./CashAvailable');

var _CashAvailable2 = _interopRequireDefault(_CashAvailable);

var _PortfolioSummary = require('./PortfolioSummary');

var _PortfolioSummary2 = _interopRequireDefault(_PortfolioSummary);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _actions = require('../actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InvestorApp = function () {
  function InvestorApp(investor) {
    _classCallCheck(this, InvestorApp);

    this.investor = investor;
    this.wallet = investor.wallet;

    this.onLoanSelect = this.onLoanSelect.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.exit = this.exit.bind(this);
  }

  _createClass(InvestorApp, [{
    key: 'start',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.store = (0, _redux.createStore)(_reducers2.default);
                this.store.subscribe(this.onStateChange);

                // Creating our screen
                this.screen = _blessed2.default.screen({
                  autoPadding: true,
                  smartCSR: true
                });

                this.loansOutstanding = new _LoansOutstanding2.default(this.onLoanSelect);
                this.terms = new _Terms2.default();
                this.cashAvailable = new _CashAvailable2.default();
                this.logs = new _Logs2.default();
                this.riskBreakdownChart = new _RiskBreakdownChart2.default();
                this.portfolioSummary = new _PortfolioSummary2.default();

                // Adding a way to quit the program
                this.screen.key(['escape', 'q', 'C-c'], this.exit);

                // Hack to deal with bug related to duplicate emitKeyEvent function calls
                // -- instead of using blessed's built in key listeners, we manually
                // keep track of which item in the loan list is selected.
                this.screen.key(['down'], this.loansOutstanding.selectDown);
                this.screen.key(['up'], this.loansOutstanding.selectUp);

                this.screen.append(this.loansOutstanding.getNode());
                this.screen.append(this.terms.getNode());
                this.screen.append(this.logs.getNode());
                this.screen.append(this.riskBreakdownChart.getNode());
                this.screen.append(this.cashAvailable.getNode());
                this.screen.append(this.portfolioSummary.getNode());

                this.screen.render();
                this.screen.enableKeys();

                _context.prev = 20;
                _context.next = 23;
                return this.investor.startDaemon(this.store, this.errorCallback);

              case 23:
                _context.next = 28;
                break;

              case 25:
                _context.prev = 25;
                _context.t0 = _context['catch'](20);

                console.error(_context.t0.stack);

              case 28:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[20, 25]]);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'onStateChange',
    value: function onStateChange() {
      try {
        var state = this.store.getState();
        this.loansOutstanding.render(state.investments);
        this.terms.render(state.visibleTerms, state.investments);
        this.logs.render(state.logs);
        this.riskBreakdownChart.render(state.investments);
        this.cashAvailable.render(state.totalCash, this.wallet.getAddress());
        this.portfolioSummary.render(state.portfolioSummary);
        this.screen.render();
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'onLoanSelect',
    value: function onLoanSelect(index) {
      this.store.dispatch((0, _actions.displayTerms)(index));
    }
  }, {
    key: 'errorCallback',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(err) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.investor.stopDaemon();

              case 2:
                this.screen.destroy();
                console.log(err);
                setTimeout(function () {
                  process.exit(1);
                }, 200);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function errorCallback(_x) {
        return _ref2.apply(this, arguments);
      }

      return errorCallback;
    }()
  }, {
    key: 'exit',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.investor.stopDaemon();

              case 2:
                setTimeout(function () {
                  process.exit(0);
                }, 200);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function exit() {
        return _ref3.apply(this, arguments);
      }

      return exit;
    }()
  }]);

  return InvestorApp;
}();

module.exports = InvestorApp;