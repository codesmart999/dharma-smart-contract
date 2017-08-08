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

var _TermsSchema = require('./TermsSchema.js');

var _TermsSchema2 = _interopRequireDefault(_TermsSchema);

var _SignatureSchema = require('./SignatureSchema.js');

var _SignatureSchema2 = _interopRequireDefault(_SignatureSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoanSchema = function (_Schema) {
  (0, _inherits3.default)(LoanSchema, _Schema);

  function LoanSchema(web3) {
    (0, _classCallCheck3.default)(this, LoanSchema);

    var schema = {
      uuid: new _Schema2.Bytes32Type(),
      borrower: new _Schema2.AddressType(web3),
      principal: new _Schema2.NumberType(),
      terms: new _TermsSchema2.default(),
      attestor: new _Schema2.AddressType(web3),
      attestorFee: new _Schema2.NumberType(),
      defaultRisk: new _Schema2.NumberType(),
      signature: new _SignatureSchema2.default({ optional: true }),
      auctionPeriodLength: new _Schema2.NumberType(),
      reviewPeriodLength: new _Schema2.NumberType(),
      auctionPeriodEndBock: new _Schema2.NumberType({ optional: true }),
      reviewPeriodEndBlock: new _Schema2.NumberType({ optional: true })
    };
    return (0, _possibleConstructorReturn3.default)(this, (LoanSchema.__proto__ || (0, _getPrototypeOf2.default)(LoanSchema)).call(this, 'Loan', schema));
  }

  return LoanSchema;
}(_Schema2.Schema);

module.exports = LoanSchema;