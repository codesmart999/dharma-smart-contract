'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Schema2 = require('./Schema.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AttestationSchema = function (_Schema) {
  (0, _inherits3.default)(AttestationSchema, _Schema);

  function AttestationSchema(web3) {
    (0, _classCallCheck3.default)(this, AttestationSchema);

    var schema = {
      uuid: new _Schema2.Bytes32Type(),
      borrower: new _Schema2.AddressType(web3),
      principal: new _Schema2.NumberType(),
      terms: new _Schema2.BytesType(),
      attestor: new _Schema2.AddressType(web3),
      attestorFee: new _Schema2.NumberType(),
      defaultRisk: new _Schema2.NumberType()
    };
    return (0, _possibleConstructorReturn3.default)(this, (AttestationSchema.__proto__ || (0, _getPrototypeOf2.default)(AttestationSchema)).call(this, 'Attestation', schema));
  }

  return AttestationSchema;
}(_Schema2.Schema);

module.exports = AttestationSchema;