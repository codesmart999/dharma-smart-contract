'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _Loans = require('./Loans.js');

var _Loans2 = _interopRequireDefault(_Loans);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dharma = function Dharma(web3) {
  (0, _classCallCheck3.default)(this, Dharma);

  this.web3 = web3;
  this.loans = new _Loans2.default(web3);
};

module.exports = Dharma;