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

var TermsSchema = function (_Schema) {
  (0, _inherits3.default)(TermsSchema, _Schema);

  function TermsSchema() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, TermsSchema);

    var schema = {
      version: new _Schema2.NumberType(),
      periodType: new _Schema2.PeriodType(),
      periodLength: new _Schema2.NumberType(),
      termLength: new _Schema2.NumberType(),
      compounded: new _Schema2.BooleanType()
    };
    return (0, _possibleConstructorReturn3.default)(this, (TermsSchema.__proto__ || (0, _getPrototypeOf2.default)(TermsSchema)).call(this, 'Terms', schema, options));
  }

  return TermsSchema;
}(_Schema2.Schema);

module.exports = TermsSchema;