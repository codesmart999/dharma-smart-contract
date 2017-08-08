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

var _Loan = require('./Loan.js');

var _Loan2 = _interopRequireDefault(_Loan);

var _Terms = require('./Terms.js');

var _Terms2 = _interopRequireDefault(_Terms);

var _Attestation = require('./Attestation.js');

var _Attestation2 = _interopRequireDefault(_Attestation);

var _LoanContract = require('./contract_wrappers/LoanContract.js');

var _LoanContract2 = _interopRequireDefault(_LoanContract);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _Events = require('./events/Events.js');

var _Events2 = _interopRequireDefault(_Events);

var _Constants = require('./Constants.js');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loans = function () {
  function Loans(web3) {
    (0, _classCallCheck3.default)(this, Loans);

    this.web3 = web3;
    this.events = new _Events2.default(web3);
  }

  (0, _createClass3.default)(Loans, [{
    key: 'create',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!data.uuid) {
                  data.uuid = this.web3.sha3((0, _uuid2.default)());
                }

                return _context.abrupt('return', _Loan2.default.create(this.web3, data));

              case 2:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x) {
        return _ref.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: 'get',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(uuid) {
        var web3, contract, data, loanData, signature, loanCreated, loanCreatedEvents, loanCreatedBlock, auctionPeriodEndBlock, reviewPeriodEndBlock, termBegin, termBeginEvents, block;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                web3 = this.web3;
                _context2.next = 3;
                return _LoanContract2.default.instantiate(this.web3);

              case 3:
                contract = _context2.sent;
                _context2.next = 6;
                return contract.getData.call(uuid);

              case 6:
                data = _context2.sent;
                loanData = {
                  uuid: uuid,
                  borrower: data[0],
                  principal: this.web3.toBigNumber(data[1]),
                  terms: _Terms2.default.byteStringToJson(this.web3, data[2]),
                  attestor: data[3],
                  attestorFee: this.web3.toBigNumber(data[4]),
                  defaultRisk: this.web3.toBigNumber(data[5])
                };
                _context2.next = 10;
                return contract.getAttestorSignature.call(uuid);

              case 10:
                signature = _context2.sent;

                loanData.signature = _Attestation2.default.fromSignatureData(this.web3, signature);

                _context2.next = 14;
                return this.events.created({ uuid: uuid }, { fromBlock: 0, toBlock: 'latest' });

              case 14:
                loanCreated = _context2.sent;
                _context2.next = 17;
                return new _promise2.default(function (accept, reject) {
                  loanCreated.get(function (err, loanCreatedEvents) {
                    if (err) reject(err);else accept(loanCreatedEvents);
                  });
                });

              case 17:
                loanCreatedEvents = _context2.sent;

                if (!(loanCreatedEvents.length === 0)) {
                  _context2.next = 20;
                  break;
                }

                return _context2.abrupt('return', null);

              case 20:
                loanCreatedBlock = loanCreatedEvents[0].args.blockNumber;
                _context2.next = 23;
                return contract.getAuctionEndBlock.call(uuid);

              case 23:
                auctionPeriodEndBlock = _context2.sent;
                _context2.next = 26;
                return contract.getReviewPeriodEndBlock.call(uuid);

              case 26:
                reviewPeriodEndBlock = _context2.sent;


                loanData.auctionPeriodEndBlock = this.web3.toBigNumber(auctionPeriodEndBlock);
                loanData.reviewPeriodEndBlock = this.web3.toBigNumber(reviewPeriodEndBlock);

                loanData.auctionPeriodLength = auctionPeriodEndBlock.minus(loanCreatedBlock);
                loanData.reviewPeriodLength = reviewPeriodEndBlock.minus(auctionPeriodEndBlock);

                _context2.next = 33;
                return contract.getState.call(uuid);

              case 33:
                loanData.state = _context2.sent;

                loanData.state = loanData.state.toNumber();

                if (!(loanData.state == _Constants2.default.ACCEPTED_STATE)) {
                  _context2.next = 50;
                  break;
                }

                _context2.next = 38;
                return contract.getInterestRate.call(uuid);

              case 38:
                loanData.interestRate = _context2.sent;
                _context2.next = 41;
                return this.events.termBegin({ uuid: uuid }, { fromBlock: 0, toBlock: 'latest' });

              case 41:
                termBegin = _context2.sent;
                _context2.next = 44;
                return new _promise2.default(function (resolve, reject) {
                  termBegin.get(function (err, termBeginEvents) {
                    if (err) reject(err);else resolve(termBeginEvents);
                  });
                });

              case 44:
                termBeginEvents = _context2.sent;

                loanData.termBeginBlockNumber = termBeginEvents[0].args.blockNumber;
                _context2.next = 48;
                return new _promise2.default(function (resolve, reject) {
                  web3.eth.getBlock(loanData.termBeginBlockNumber, function (err, block) {
                    if (err) reject(err);else resolve(block);
                  });
                });

              case 48:
                block = _context2.sent;

                loanData.termBeginTimestamp = block.timestamp;

              case 50:
                return _context2.abrupt('return', _Loan2.default.create(this.web3, loanData));

              case 51:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x2) {
        return _ref2.apply(this, arguments);
      }

      return get;
    }()
  }]);
  return Loans;
}();

module.exports = Loans;