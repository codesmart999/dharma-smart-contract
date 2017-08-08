'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Type = function Type() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck3.default)(this, Type);

  this.options = options;
};

var AddressType = function (_Type) {
  (0, _inherits3.default)(AddressType, _Type);

  function AddressType(web3, options) {
    (0, _classCallCheck3.default)(this, AddressType);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AddressType.__proto__ || (0, _getPrototypeOf2.default)(AddressType)).call(this, options));

    _this.web3 = web3;
    return _this;
  }

  (0, _createClass3.default)(AddressType, [{
    key: 'validate',
    value: function validate(term) {
      if (!this.web3.isAddress(term)) throw new Error('Address format is invalid');
    }
  }]);
  return AddressType;
}(Type);

var Bytes32Type = function (_Type2) {
  (0, _inherits3.default)(Bytes32Type, _Type2);

  function Bytes32Type() {
    (0, _classCallCheck3.default)(this, Bytes32Type);
    return (0, _possibleConstructorReturn3.default)(this, (Bytes32Type.__proto__ || (0, _getPrototypeOf2.default)(Bytes32Type)).apply(this, arguments));
  }

  (0, _createClass3.default)(Bytes32Type, [{
    key: 'validate',
    value: function validate(term) {
      if (!/0x[0-9A-Fa-f]{64}/g.test(term)) throw new Error(term + ' is not a valid Bytes32Type');
    }
  }]);
  return Bytes32Type;
}(Type);

var Bytes1Type = function (_Type3) {
  (0, _inherits3.default)(Bytes1Type, _Type3);

  function Bytes1Type() {
    (0, _classCallCheck3.default)(this, Bytes1Type);
    return (0, _possibleConstructorReturn3.default)(this, (Bytes1Type.__proto__ || (0, _getPrototypeOf2.default)(Bytes1Type)).apply(this, arguments));
  }

  (0, _createClass3.default)(Bytes1Type, [{
    key: 'validate',
    value: function validate(term) {
      if (!/0x[0-9A-Fa-f]{2}/g.test(term)) throw new Error(term + ' is not a valid Bytes1Type');
    }
  }]);
  return Bytes1Type;
}(Type);

var BytesType = function (_Type4) {
  (0, _inherits3.default)(BytesType, _Type4);

  function BytesType() {
    (0, _classCallCheck3.default)(this, BytesType);
    return (0, _possibleConstructorReturn3.default)(this, (BytesType.__proto__ || (0, _getPrototypeOf2.default)(BytesType)).apply(this, arguments));
  }

  (0, _createClass3.default)(BytesType, [{
    key: 'validate',
    value: function validate(term) {
      if (!/0x[0-9A-Fa-f]+/g.test(term)) throw new Error(term + ' is not a valid BytesType');
    }
  }]);
  return BytesType;
}(Type);

var NumberType = function (_Type5) {
  (0, _inherits3.default)(NumberType, _Type5);

  function NumberType() {
    (0, _classCallCheck3.default)(this, NumberType);
    return (0, _possibleConstructorReturn3.default)(this, (NumberType.__proto__ || (0, _getPrototypeOf2.default)(NumberType)).apply(this, arguments));
  }

  (0, _createClass3.default)(NumberType, [{
    key: 'validate',
    value: function validate(term) {
      try {
        var bigNumber = new _bignumber2.default(term);
      } catch (err) {
        throw new Error(term + ' is not a valid number: ' + err);
      }
    }
  }]);
  return NumberType;
}(Type);

var BooleanType = function (_Type6) {
  (0, _inherits3.default)(BooleanType, _Type6);

  function BooleanType() {
    (0, _classCallCheck3.default)(this, BooleanType);
    return (0, _possibleConstructorReturn3.default)(this, (BooleanType.__proto__ || (0, _getPrototypeOf2.default)(BooleanType)).apply(this, arguments));
  }

  (0, _createClass3.default)(BooleanType, [{
    key: 'validate',
    value: function validate(term) {
      if (typeof term !== 'boolean') throw new Error(term + ' is not a valid boolean');
    }
  }]);
  return BooleanType;
}(Type);

var PeriodType = function (_Type7) {
  (0, _inherits3.default)(PeriodType, _Type7);

  function PeriodType() {
    (0, _classCallCheck3.default)(this, PeriodType);
    return (0, _possibleConstructorReturn3.default)(this, (PeriodType.__proto__ || (0, _getPrototypeOf2.default)(PeriodType)).apply(this, arguments));
  }

  (0, _createClass3.default)(PeriodType, [{
    key: 'validate',
    value: function validate(term) {
      if (!(term === 'daily' || term === 'weekly' || term === 'monthly' || term === 'yearly' || term === 'fixed')) throw new Error('Invalid period type');
    }
  }]);
  return PeriodType;
}(Type);

var Schema = function () {
  function Schema(name, schema) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, Schema);

    this.name = name;
    this.schema = schema;
    this.options = options;
  }

  (0, _createClass3.default)(Schema, [{
    key: 'validate',
    value: function validate(terms) {
      for (var key in this.schema) {
        if (!(key in terms)) {
          if (!this.schema[key].options.optional) {
            throw 'Required term ' + key + ' is missing.';
          }
        } else {
          this.schema[key].validate(terms[key]);
        }
      }
    }
  }]);
  return Schema;
}();

module.exports = { Schema: Schema, BooleanType: BooleanType, BytesType: BytesType, Bytes32Type: Bytes32Type, Bytes1Type: Bytes1Type,
  AddressType: AddressType, NumberType: NumberType, PeriodType: PeriodType };