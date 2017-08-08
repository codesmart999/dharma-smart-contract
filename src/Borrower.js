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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Borrower = function () {
  function Borrower(web3, authToken) {
    _classCallCheck(this, Borrower);

    var env = process.env.ENV || 'production';

    this.dharmaClient = new _dharmaClient2.default(web3, authToken, env);
  }

  _createClass(Borrower, [{
    key: 'fetchLimit',
    value: async function fetchLimit() {
      return await this.dharmaClient.fetchLimit();
    }
  }, {
    key: 'requestSignedLoan',
    value: async function requestSignedLoan(address, amount) {
      return await this.dharmaClient.requestSignedLoan(address, amount);
    }
  }, {
    key: 'requestDeploymentStipend',
    value: async function requestDeploymentStipend(address) {
      return await this.dharmaClient.requestDeploymentStipend(address);
    }
  }, {
    key: 'broadcastLoanRequest',
    value: async function broadcastLoanRequest(address, amount, deployedCallback, reviewCallback) {
      return await this.dharmaClient.broadcastLoanRequest(address, amount, deployedCallback, reviewCallback);
    }
  }, {
    key: 'acceptLoanTerms',
    value: async function acceptLoanTerms(loan, bids) {
      await loan.acceptBids(bids);

      var liabilities = void 0;
      try {
        liabilities = await _Liabilities2.default.load(this.dharma);
      } catch (err) {
        liabilities = new _Liabilities2.default();
      }

      liabilities.addLoan(loan);
      await liabilities.save();
    }
  }]);

  return Borrower;
}();

module.exports = Borrower;