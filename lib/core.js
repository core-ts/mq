"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toString(v, attributes) {
  if (attributes) {
    var ks = Object.keys(attributes);
    if (ks.length > 0) {
      if (typeof v === 'string') {
        return v + ' ' + JSON.stringify(attributes);
      }
      else {
        return JSON.stringify(v) + ' ' + JSON.stringify(attributes);
      }
    }
    else {
      return ts(v);
    }
  }
  else {
    return ts(v);
  }
}
exports.toString = toString;
function ts(v) {
  if (typeof v === 'string') {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
var RetryService = (function () {
  function RetryService(send, logError, logInfo) {
    this.send = send;
    this.logError = logError;
    this.logInfo = logInfo;
    this.retry = this.retry.bind(this);
  }
  RetryService.prototype.retry = function (data, header) {
    var _this = this;
    return this.send(data, header).then(function (res) {
      if (_this.logInfo) {
        _this.logInfo("Retry put to mq success.");
      }
      return res;
    }).catch(function (err) {
      if (_this.logError) {
        _this.logError("Retry put to mq error: " + toString(err));
      }
      throw err;
    });
  };
  return RetryService;
}());
exports.RetryService = RetryService;
var ErrorHandler = (function () {
  function ErrorHandler(logError, logInfo) {
    this.logError = logError;
    this.logInfo = logInfo;
    this.error = this.error.bind(this);
  }
  ErrorHandler.prototype.error = function (data, header) {
    if (data && this.logError) {
      this.logError("Fail to consume message: " + toString(data, header));
    }
    return new Promise(function (resolve) { return resolve(); });
  };
  return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
