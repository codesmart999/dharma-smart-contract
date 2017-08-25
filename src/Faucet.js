'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Authenticate = require('./Authenticate.js');

var _Authenticate2 = _interopRequireDefault(_Authenticate);

var _Config = require('./Config.js');

var _Config2 = _interopRequireDefault(_Config);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _Errors = require('./Errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Faucet = function () {
  function Faucet(dharma) {
    _classCallCheck(this, Faucet);

    this.dharma = dharma;
    this.web3 = dharma.web3;
    this.auth = new _Authenticate2.default();
    this.raaUri = _Config2.default.RAA_API_ROOT;
  }

  _createClass(Faucet, [{
    key: 'requestEther',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(wallet, amount) {
        var authToken, params, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.auth.getAuthToken();

              case 2:
                authToken = _context.sent;
                params = this._getRequestParams('/faucet', {
                  authToken: authToken,
                  address: wallet.getAddress(),
                  amount: amount
                });
                response = void 0;
                _context.prev = 5;
                _context.next = 8;
                return (0, _requestPromise2.default)(params);

              case 8:
                response = _context.sent;
                _context.next = 29;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context['catch'](5);

                if (!('error' in _context.t0.error)) {
                  _context.next = 28;
                  break;
                }

                _context.t1 = _context.t0.error.error;
                _context.next = _context.t1 === 'INVALID_AUTH_TOKEN' ? 17 : _context.t1 === 'INVALID_ADDRESS' ? 19 : _context.t1 === 'FAUCET_REQUEST_REJECTED' ? 21 : _context.t1 === 'INVALID_AMOUNT' ? 23 : 25;
                break;

              case 17:
                throw new _Errors.AuthenticationError('Invalid Authentication Token');

              case 19:
                throw new Error("Borrower address is invalid.");

              case 21:
                throw new _Errors.RejectionError('Sorry -- your faucet drip request has been ' + ' rejected because you already received ether from the faucet within the past few days');

              case 23:
                throw new Error('Invalid amount requested.');

              case 25:
                throw new Error(_context.t0.error.error);

              case 26:
                _context.next = 29;
                break;

              case 28:
                throw new Error(_context.t0);

              case 29:
                return _context.abrupt('return', response.txHash);

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 11]]);
      }));

      function requestEther(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return requestEther;
    }()
  }, {
    key: '_getRequestParams',
    value: function _getRequestParams(endpoint, params) {
      return {
        method: 'POST',
        uri: this.raaUri + endpoint,
        body: params,
        json: true
      };
    }
  }]);

  return Faucet;
}();

module.exports = Faucet;