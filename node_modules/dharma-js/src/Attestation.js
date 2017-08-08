'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _AttestationSchema = require('./schemas/AttestationSchema.js');

var _AttestationSchema2 = _interopRequireDefault(_AttestationSchema);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

var _Util = require('./Util.js');

var _Util2 = _interopRequireDefault(_Util);

var _ethereumjsUtil = require('ethereumjs-util');

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Attestation = function () {
  function Attestation(web3, data) {
    (0, _classCallCheck3.default)(this, Attestation);

    this.web3 = web3;

    this.schema = new _AttestationSchema2.default(web3);
    this.schema.validate(data);

    this.attestor = data.attestor;
    this.data = data;
  }

  (0, _createClass3.default)(Attestation, [{
    key: 'sign',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var web3, attestor, data;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                web3 = this.web3;
                attestor = this.attestor;
                data = web3.toHex((0, _jsonStableStringify2.default)(this.data));
                _context.next = 5;
                return new _promise2.default(function (accept, reject) {
                  web3.eth.sign(attestor, data, function (err, signatureRaw) {
                    if (err) {
                      console.log(err);
                      reject(err);
                    } else {
                      var signature = _Util2.default.stripZeroEx(signatureRaw);
                      accept({
                        r: '0x' + signature.slice(0, 64),
                        s: '0x' + signature.slice(64, 128),
                        v: '0x' + signature.slice(128, 130)
                      });
                    }
                  });
                });

              case 5:
                return _context.abrupt('return', _context.sent);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sign() {
        return _ref.apply(this, arguments);
      }

      return sign;
    }()
  }, {
    key: 'verifySignature',
    value: function verifySignature(signature) {
      var web3 = this.web3;

      var r = _ethereumjsUtil2.default.toBuffer(signature.r);
      var s = _ethereumjsUtil2.default.toBuffer(signature.s);
      var v = this.web3.toDecimal(signature.v);

      if (v < 27) v += 27;

      var dataBuffer = _ethereumjsUtil2.default.toBuffer((0, _jsonStableStringify2.default)(this.data));
      var encodedMessage = _ethereumjsUtil2.default.hashPersonalMessage(dataBuffer);

      try {
        var pubKey = _ethereumjsUtil2.default.ecrecover(encodedMessage, v, r, s);
        var retrievedAddress = _ethereumjsUtil2.default.bufferToHex(_ethereumjsUtil2.default.pubToAddress(pubKey));

        return retrievedAddress === this.attestor;
      } catch (err) {
        return false;
      }
    }
  }], [{
    key: 'fromSignatureData',
    value: function fromSignatureData(web3, signature) {
      var v = _Util2.default.stripZeroEx(web3.toHex(signature[2]));

      return {
        r: signature[0],
        s: signature[1],
        v: '0x' + _Util2.default.padLeft(v, 2)
      };
    }
  }]);
  return Attestation;
}();

module.exports = Attestation;