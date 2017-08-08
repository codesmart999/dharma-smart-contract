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

var SignatureSchema = function (_Schema) {
  (0, _inherits3.default)(SignatureSchema, _Schema);

  function SignatureSchema() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, SignatureSchema);

    var schema = {
      r: new _Schema2.Bytes32Type(),
      s: new _Schema2.Bytes32Type(),
      v: new _Schema2.Bytes1Type()
    };
    return (0, _possibleConstructorReturn3.default)(this, (SignatureSchema.__proto__ || (0, _getPrototypeOf2.default)(SignatureSchema)).call(this, 'Signature', schema, options));
  }

  return SignatureSchema;
}(_Schema2.Schema);

module.exports = SignatureSchema;