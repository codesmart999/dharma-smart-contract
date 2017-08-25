'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _Constants = require('../Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIABILITIES_STORE_FILE = _os2.default.homedir() + '/.dharma/liabilities.json';

var Liabilities = function () {
  function Liabilities() {
    var loans = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Liabilities);

    this.loans = loans;
  }

  _createClass(Liabilities, [{
    key: 'save',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var raw;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                raw = this.toJson();
                _context.next = 3;
                return _fsExtra2.default.outputJson(LIABILITIES_STORE_FILE, raw);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'toJson',
    value: function toJson() {
      return Object.keys(this.loans);
    }
  }, {
    key: 'addLoan',
    value: function addLoan(loan) {
      this.loans[loan.uuid] = loan;
    }
  }], [{
    key: 'load',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(dharma) {
        var raw, loans, promises;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                raw = void 0;
                _context3.prev = 1;
                _context3.next = 4;
                return _fsExtra2.default.readJson(LIABILITIES_STORE_FILE);

              case 4:
                raw = _context3.sent;
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3['catch'](1);
                throw new Error('Liabilities store file does not exist.');

              case 10:
                loans = {};
                promises = raw.map(function (uuid) {
                  return new Promise(function () {
                    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(resolve, reject) {
                      var loan;
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.prev = 0;
                              _context2.next = 3;
                              return dharma.loans.get(uuid);

                            case 3:
                              loan = _context2.sent;

                              if (loan.state === _Constants2.default.ACCEPTED_STATE) {
                                loans[uuid] = loan;
                              }
                              resolve();
                              _context2.next = 11;
                              break;

                            case 8:
                              _context2.prev = 8;
                              _context2.t0 = _context2['catch'](0);

                              reject(_context2.t0);

                            case 11:
                            case 'end':
                              return _context2.stop();
                          }
                        }
                      }, _callee2, this, [[0, 8]]);
                    }));

                    return function (_x3, _x4) {
                      return _ref3.apply(this, arguments);
                    };
                  }());
                });
                _context3.next = 14;
                return Promise.all(promises).catch(function (err) {
                  throw err;
                });

              case 14:
                return _context3.abrupt('return', new Liabilities(loans));

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 7]]);
      }));

      function load(_x2) {
        return _ref2.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return Liabilities;
}();

module.exports = Liabilities;