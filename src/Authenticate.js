'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _Errors = require('./Errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Authenticate = function () {
  function Authenticate() {
    _classCallCheck(this, Authenticate);

    this.storeFile = _os2.default.homedir() + '/.dharma/auth.json';
  }

  _createClass(Authenticate, [{
    key: 'getAuthToken',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var auth;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _fsExtra2.default.readJson(this.storeFile);

              case 3:
                auth = _context.sent;
                return _context.abrupt('return', auth.token);

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);
                throw new _Errors.AuthenticationError('Auth token file does not exist or is unreadable.');

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function getAuthToken() {
        return _ref.apply(this, arguments);
      }

      return getAuthToken;
    }()
  }, {
    key: 'setAuthToken',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(token) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _fsExtra2.default.outputJson(this.storeFile, { token: token });

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setAuthToken(_x) {
        return _ref2.apply(this, arguments);
      }

      return setAuthToken;
    }()
  }]);

  return Authenticate;
}();

module.exports = Authenticate;