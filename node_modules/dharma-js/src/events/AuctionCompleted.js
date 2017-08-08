'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Util = require('../Util.js');

var _Util2 = _interopRequireDefault(_Util);

var _LoanContract = require('../contract_wrappers/LoanContract.js');

var _LoanContract2 = _interopRequireDefault(_LoanContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuctionCompleted = function () {
  function AuctionCompleted(web3, auctionPeriodEndBlock) {
    (0, _classCallCheck3.default)(this, AuctionCompleted);

    this.web3 = web3;
    this.auctionPeriodEndBlock = auctionPeriodEndBlock;
    this.blockListener = null;
    this.listening = false;
  }

  (0, _createClass3.default)(AuctionCompleted, [{
    key: 'watch',
    value: function watch(callback) {
      var web3 = this.web3;
      var auctionPeriodEndBlock = this.auctionPeriodEndBlock;

      this.listening = true;

      this.blockListener = this.web3.eth.filter('latest');
      this.blockListener.watch(function (err, result) {
        if (err) {
          this.listening = false;
          callback(err, null);
        } else {
          web3.eth.getBlockNumber(function (err, blockNumber) {

            if (!this.listening) return;

            if (auctionPeriodEndBlock.lt(blockNumber)) {
              this.listening = false;

              callback(null, blockNumber);
            }
          }.bind(this));
        }
      }.bind(this));
    }
  }, {
    key: 'stopWatching',
    value: function stopWatching(callback) {
      this.listening = false;
      this.blockListener.stopWatching(callback);
    }
  }], [{
    key: 'create',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(web3, options, callback) {
        var contract, auctionPeriodEndBlock, auctionCompletedEvent;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _LoanContract2.default.instantiate(web3);

              case 2:
                contract = _context.sent;

                if (!(options.uuid === 'undefined')) {
                  _context.next = 5;
                  break;
                }

                throw new Error('AuctionCompleted event requires UUID to follow.');

              case 5:
                _context.next = 7;
                return contract.getAuctionEndBlock.call(options.uuid);

              case 7:
                auctionPeriodEndBlock = _context.sent;

                if (!auctionPeriodEndBlock.equals(0)) {
                  _context.next = 10;
                  break;
                }

                throw new Error('AuctionCompleted listener can only be activated once loan' + 'has been broadcasted');

              case 10:
                auctionCompletedEvent = new AuctionCompleted(web3, auctionPeriodEndBlock);

                if (!callback) {
                  _context.next = 15;
                  break;
                }

                auctionCompletedEvent.watch(callback);
                _context.next = 16;
                break;

              case 15:
                return _context.abrupt('return', auctionCompletedEvent);

              case 16:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return create;
    }()
  }]);
  return AuctionCompleted;
}();

module.exports = AuctionCompleted;