'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _truffleContract = require('truffle-contract');

var _truffleContract2 = _interopRequireDefault(_truffleContract);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

var _Loan = require('../../contracts/Loan.json');

var _Loan2 = _interopRequireDefault(_Loan);

var _VersionRegister = require('../../contracts/VersionRegister.json');

var _VersionRegister2 = _interopRequireDefault(_VersionRegister);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoanContract = function () {
  function LoanContract() {
    (0, _classCallCheck3.default)(this, LoanContract);
  }

  (0, _createClass3.default)(LoanContract, null, [{
    key: 'instantiate',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(web3) {
        var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _package2.default;
        var VersionRegister, Loan, versionRegisterInstance, contractVersion, localVersion, loanContractAddress;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                VersionRegister = new _truffleContract2.default(_VersionRegister2.default);
                Loan = new _truffleContract2.default(_Loan2.default);


                VersionRegister.defaults({ from: web3.eth.defaultAccount });
                Loan.defaults({ from: web3.eth.defaultAccount });

                VersionRegister.setProvider(web3.currentProvider);
                Loan.setProvider(web3.currentProvider);

                _context.next = 8;
                return VersionRegister.deployed();

              case 8:
                versionRegisterInstance = _context.sent;
                _context.next = 11;
                return versionRegisterInstance.currentVersion.call();

              case 11:
                contractVersion = _context.sent;
                localVersion = {
                  major: 0,
                  minor: 1,
                  patch: 0
                };

                if (!(contractVersion[0] != localVersion.major || contractVersion[1] != localVersion.minor || contractVersion[2] != localVersion.patch)) {
                  _context.next = 15;
                  break;
                }

                throw new Error('This version of dharma.js is trying to access a ' + 'deprecated version of the Dharma Protocol contract.  This can ' + 'be resolved by upgrading the dharma.js package.');

              case 15:
                _context.next = 17;
                return versionRegisterInstance.getContractByVersion.call(localVersion.major, localVersion.minor, localVersion.patch);

              case 17:
                loanContractAddress = _context.sent;
                _context.next = 20;
                return Loan.deployed();

              case 20:
                return _context.abrupt('return', _context.sent);

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function instantiate(_x) {
        return _ref.apply(this, arguments);
      }

      return instantiate;
    }()
  }]);
  return LoanContract;
}();

module.exports = LoanContract;