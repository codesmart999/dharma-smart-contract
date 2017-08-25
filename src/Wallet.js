'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ethereumjsWallet = require('ethereumjs-wallet');

var _ethereumjsWallet2 = _interopRequireDefault(_ethereumjsWallet);

var _hdkey = require('ethereumjs-wallet/hdkey');

var _hdkey2 = _interopRequireDefault(_hdkey);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _providerEngine = require('ethereumjs-wallet/provider-engine');

var _providerEngine2 = _interopRequireDefault(_providerEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DERIVATION_PATH = "m/44'/60'/0'/0";
var DEFAULT_STORE_FILE = _os2.default.homedir() + '/.dharma/wallet.json';

var Wallet = function () {
  function Wallet(ethJSWallet) {
    var _this = this;

    var mnemonic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var storeFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_STORE_FILE;

    _classCallCheck(this, Wallet);

    this.mnemonic = mnemonic;
    this.ethJSWallet = ethJSWallet;

    this.ethJSWallet.getAddressesString = function () {
      return _this.getAddress();
    };

    this.storeFile = storeFile;
  }

  _createClass(Wallet, [{
    key: 'getMnemonic',
    value: function getMnemonic() {
      if (!this.mnemonic) throw new Error("Mnemonics cannot be retrieved from local wallets.");
      return this.mnemonic;
    }
  }, {
    key: 'getAddress',
    value: function getAddress() {
      var pubKey = this.ethJSWallet.getPublicKey();
      return _ethereumjsUtil2.default.bufferToHex(_ethereumjsUtil2.default.pubToAddress(pubKey));
    }
  }, {
    key: 'getPrivateKey',
    value: function getPrivateKey() {
      var privKey = this.ethJSWallet.getPublicKey();
      return _ethereumjsUtil2.default.bufferToHex(privKey);
    }
  }, {
    key: 'getSubprovider',
    value: function getSubprovider() {
      return new _providerEngine2.default(this.ethJSWallet, {});
    }
  }, {
    key: 'save',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(passphrase) {
        var wallets, v3WalletObject, address;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                wallets = void 0;
                _context.prev = 1;
                _context.next = 4;
                return _fsExtra2.default.readJson(this.storeFile);

              case 4:
                wallets = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](1);

                // No wallets have been created yet.
                wallets = {};

              case 10:
                v3WalletObject = this.ethJSWallet.toV3(passphrase);
                address = v3WalletObject.address;

                wallets[address] = v3WalletObject;

                _context.next = 15;
                return _fsExtra2.default.outputJson(this.storeFile, wallets);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7]]);
      }));

      function save(_x3) {
        return _ref.apply(this, arguments);
      }

      return save;
    }()
  }], [{
    key: 'generate',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(passphrase, walletStoreFile) {
        var mnemonic, seed, masterNode, node, ethJSWallet, wallet;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (passphrase) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('User must enter passphrase.');

              case 2:
                mnemonic = _bip2.default.generateMnemonic();
                seed = _bip2.default.mnemonicToSeed(mnemonic);
                masterNode = _hdkey2.default.fromMasterSeed(seed);
                node = masterNode.derivePath(DERIVATION_PATH);
                ethJSWallet = node.getWallet();
                wallet = new Wallet(ethJSWallet, mnemonic, walletStoreFile);
                _context2.next = 10;
                return wallet.save(passphrase);

              case 10:
                return _context2.abrupt('return', wallet);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function generate(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return generate;
    }()
  }, {
    key: 'recoverWallet',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(mnemonic) {
        var storeFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_STORE_FILE;
        var wallets, address, seed, masterNode, node, ethJSWallet, wallet;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                wallets = void 0;
                _context3.prev = 1;
                _context3.next = 4;
                return _fsExtra2.default.readJson(storeFile);

              case 4:
                wallets = _context3.sent;
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3['catch'](1);
                throw new Error('No such wallet exists.');

              case 10:
                address = Object.keys(wallets)[0];
                seed = _bip2.default.mnemonicToSeed(mnemonic);
                masterNode = _hdkey2.default.fromMasterSeed(seed);
                node = masterNode.derivePath(DERIVATION_PATH);
                ethJSWallet = node.getWallet();
                wallet = new Wallet(ethJSWallet, mnemonic, storeFile);
                // const walletAddress = Util.stripZeroEx(wallet.getAddress())
                //
                // if (walletAddress !== address)
                //   throw new Error('Incorrect seed phrase.');

                return _context3.abrupt('return', wallet);

              case 17:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 7]]);
      }));

      function recoverWallet(_x7) {
        return _ref3.apply(this, arguments);
      }

      return recoverWallet;
    }()
  }, {
    key: 'getWallet',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(passphrase) {
        var storeFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_STORE_FILE;
        var wallets, address, ethJSWallet;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                wallets = void 0;
                _context4.prev = 1;
                _context4.next = 4;
                return _fsExtra2.default.readJson(storeFile);

              case 4:
                wallets = _context4.sent;
                _context4.next = 10;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4['catch'](1);
                throw new Error('No such wallet exists.');

              case 10:
                address = Object.keys(wallets)[0];
                _context4.prev = 11;
                ethJSWallet = _ethereumjsWallet2.default.fromV3(wallets[address], passphrase);
                return _context4.abrupt('return', new Wallet(ethJSWallet));

              case 16:
                _context4.prev = 16;
                _context4.t1 = _context4['catch'](11);
                throw new Error("Passphrase is incorrect.");

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 7], [11, 16]]);
      }));

      function getWallet(_x9) {
        return _ref4.apply(this, arguments);
      }

      return getWallet;
    }()
  }, {
    key: 'walletExists',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
        var storeFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STORE_FILE;
        var wallets;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _fsExtra2.default.readJson(storeFile);

              case 3:
                wallets = _context5.sent;
                return _context5.abrupt('return', true);

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5['catch'](0);
                return _context5.abrupt('return', false);

              case 10:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function walletExists() {
        return _ref5.apply(this, arguments);
      }

      return walletExists;
    }()
  }]);

  return Wallet;
}();

module.exports = Wallet;