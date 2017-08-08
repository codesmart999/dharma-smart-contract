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

var BidSchema = function (_Schema) {
  (0, _inherits3.default)(BidSchema, _Schema);

  function BidSchema(web3) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, BidSchema);

    var schema = {
      bidder: new _Schema2.AddressType(web3),
      amount: new _Schema2.NumberType()
    };
    return (0, _possibleConstructorReturn3.default)(this, (BidSchema.__proto__ || (0, _getPrototypeOf2.default)(BidSchema)).call(this, 'Bid', schema, options));
  }

  return BidSchema;
}(_Schema2.Schema);

module.exports = BidSchema;