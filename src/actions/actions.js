'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var initState = exports.initState = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(portfolio) {
    var summary, portfolioJson;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return portfolio.getSummary();

          case 2:
            summary = _context.sent;
            portfolioJson = portfolio.toJson();
            return _context.abrupt('return', {
              type: INIT_STATE,
              summary: summary,
              portfolio: portfolioJson
            });

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function initState(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.addInvestment = addInvestment;
exports.updateInvestment = updateInvestment;
exports.displayTerms = displayTerms;
exports.log = log;
exports.updateTotalCash = updateTotalCash;
exports.updatePortfolioSummary = updatePortfolioSummary;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ADD_INVESTMENT = exports.ADD_INVESTMENT = 'ADD_INVESTMENT';
function addInvestment(investment) {
  var investmentJson = void 0;
  try {
    investmentJson = investment.toJson();
  } catch (err) {
    console.log(err);
  }

  return {
    type: ADD_INVESTMENT,
    investment: investmentJson
  };
}

var UPDATE_INVESTMENT = exports.UPDATE_INVESTMENT = 'UPDATE_INVESTMENT';
function updateInvestment(investment) {
  var investmentJson = void 0;
  try {
    investmentJson = investment.toJson();
  } catch (err) {
    console.log(err);
  }

  return {
    type: UPDATE_INVESTMENT,
    investment: investmentJson
  };
}

var DISPLAY_TERMS = exports.DISPLAY_TERMS = 'DISPLAY_TERMS';
function displayTerms(index) {
  var action = {
    index: index,
    type: DISPLAY_TERMS
  };
  return action;
}

var INIT_STATE = exports.INIT_STATE = 'INIT_STATE';
var LOG_MESSAGE = exports.LOG_MESSAGE = 'LOG_MESSAGE';
function log(type, message) {
  var startTag = void 0;
  var endTag = void 0;
  switch (type) {
    case 'info':
      startTag = "{cyan-fg}";
      endTag = "{/cyan-fg}";
      break;
    case 'success':
      startTag = "{green-fg}";
      endTag = "{/green-fg}";
      break;
    case 'error':
      startTag = "{red-fg}";
      endTag = "{/red-fg}";
      break;
    default:
      startTag = "{white-fg}";
      endTag = "{/white-fg}";
      break;
  }

  return {
    message: startTag + message + endTag,
    type: LOG_MESSAGE
  };
}

var UPDATE_TOTAL_CASH = exports.UPDATE_TOTAL_CASH = 'UPDATE_TOTAL_CASH';
function updateTotalCash(totalCash) {
  return {
    type: UPDATE_TOTAL_CASH,
    totalCash: totalCash
  };
}

var UPDATE_PORTFOLIO_SUMMARY = exports.UPDATE_PORTFOLIO_SUMMARY = 'UPDATE_PORTFOLIO_SUMMARY';
function updatePortfolioSummary(summary) {
  return {
    type: UPDATE_PORTFOLIO_SUMMARY,
    principalOutstanding: summary.principalOutstanding,
    principalCollected: summary.principalCollected,
    interestCollected: summary.interestCollected,
    totalCash: summary.totalCash,
    defaultedValue: summary.defaultedValue
  };
}