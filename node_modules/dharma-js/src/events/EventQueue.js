'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventQueue = function () {
  function EventQueue(identifier, event) {
    (0, _classCallCheck3.default)(this, EventQueue);

    this.identifier = identifier;
    this.event = event;
    this.queue = [];
    this.callbacks = {};
    this.length = 0;
    this.watching = false;

    this.execute = this.execute.bind(this);
  }

  (0, _createClass3.default)(EventQueue, [{
    key: 'enqueue',
    value: function enqueue(id, callback) {
      this.callbacks[id] = callback;
      this.queue.push(id);
      this.length += 1;

      if (!this.watching) {
        this.event.watch(this.execute);
        this.watching = true;
      }
    }
  }, {
    key: 'remove',
    value: function remove(id, callback) {
      // console.log("trying to stop " + this.identifier);

      delete this.callbacks[id];
      this.queue = _lodash2.default.remove(this.queue, function (_id) {
        return id == _id;
      });

      this.length -= 1;

      if (this.length == 0 && this.watching) {
        // console.log("actually stopped " + this.identifier);
        this.event.stopWatching(callback);
      } else {
        if (callback) callback();
      }
    }
  }, {
    key: 'execute',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(err, result) {
        var executionQueue, i, id, callback;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                executionQueue = _lodash2.default.clone(this.queue);
                i = 0;

              case 2:
                if (!(i < executionQueue.length)) {
                  _context.next = 10;
                  break;
                }

                id = executionQueue[i];
                callback = this.callbacks[id];
                _context.next = 7;
                return callback(err, result);

              case 7:
                i++;
                _context.next = 2;
                break;

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()
  }], [{
    key: 'getIdentifier',
    value: function getIdentifier(eventName, filter, additionalFilter) {
      return eventName + (0, _jsonStableStringify2.default)(filter) + (0, _jsonStableStringify2.default)(additionalFilter);
    }
  }]);
  return EventQueue;
}();

module.exports = EventQueue;