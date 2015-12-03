"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResource = createResource;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var variableRegex = /(\[?[\w\-\/]*\$\{([\w]+)\}\]?)/g;

var Resource = exports.Resource = (function () {
  function Resource(url) {
    _classCallCheck(this, Resource);

    this.url = url;
  }

  _createClass(Resource, [{
    key: "parse",
    value: function parse() {}
  }]);

  return Resource;
})();

function createResource(url) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Resource(url);
}