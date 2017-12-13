"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bignumber = require("bignumber.js");

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var decimals = new _bignumber2.default(Math.pow(10, 18));

var LoanDecorator = function () {
  function LoanDecorator(loan) {
    _classCallCheck(this, LoanDecorator);

    this.loan = loan;
  }

  _createClass(LoanDecorator, [{
    key: "uuid",
    value: function uuid() {
      return this.loan.uuid.slice(0, 10) + "...";
    }
  }, {
    key: "borrower",
    value: function borrower() {
      return this.loan.borrower.slice(0, 10) + "...";
    }
  }, {
    key: "interestRate",
    value: function interestRate() {
      var interestRateDecimal = this.loan.interestRate.div(decimals).times(100).toFixed(2);
      return '%' + interestRateDecimal.toString();
    }
  }, {
    key: "principal",
    value: function principal() {
      var principalDecimal = this.loan.principal.div(decimals).toFixed(2);
      return "\u039E" + principalDecimal.toString();
    }
  }, {
    key: "totalOwed",
    value: function totalOwed() {
      var totalOwedEther = this.loan.servicing.totalOwed().div(decimals).toFixed(2);
      return "\u039E" + totalOwedEther.toString();
    }
  }, {
    key: "defaultRisk",
    value: function defaultRisk() {
      var defaultRiskDecimal = this.loan.defaultRisk.div(decimals).times(100).toFixed(2);
      return '%' + defaultRiskDecimal.toString();
    }
  }, {
    key: "currentBalanceOwed",
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var currentlyOwed, currentlyOwedEther;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.loan.servicing.currentBalanceOwed();

              case 2:
                currentlyOwed = _context.sent;
                currentlyOwedEther = currentlyOwed.div(decimals).toFixed(2);
                return _context.abrupt("return", "\u039E" + currentlyOwedEther.toString());

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function currentBalanceOwed() {
        return _ref.apply(this, arguments);
      }

      return currentBalanceOwed;
    }()
  }]);

  return LoanDecorator;
}();

module.exports = LoanDecorator;