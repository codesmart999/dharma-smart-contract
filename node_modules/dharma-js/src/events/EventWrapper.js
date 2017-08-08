'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventWrapper = function () {
  function EventWrapper(event, queue, callback) {
    (0, _classCallCheck3.default)(this, EventWrapper);

    this.event = event;
    this.id = (0, _uuid2.default)();
    this.queue = queue;

    if (callback) {
      this.watch(callback);
    }
  }

  (0, _createClass3.default)(EventWrapper, [{
    key: 'watch',
    value: function watch(callback) {
      this.queue.enqueue(this.id, callback);
    }
  }, {
    key: 'get',
    value: function get(callback) {
      this.event.get(callback);
    }
  }, {
    key: 'stopWatching',
    value: function stopWatching(callback) {
      this.queue.remove(this.id, callback);
    }
  }]);
  return EventWrapper;
}();

module.exports = EventWrapper;