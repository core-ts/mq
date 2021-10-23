"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var retry_1 = require("./retry");
var write_1 = require("./write");
function createHandler(write, validate, retry, limitRetry, retryCountName, handleError, logError, logInfo, json) {
  return new Handler(write, validate, [], handleError, logError, logInfo, retry, limitRetry, retryCountName, json);
}
exports.createHandler = createHandler;
var Handler = (function () {
  function Handler(write, validate, retries, handleError, logError, logInfo, retry, limitRetry, retryCountName, json) {
    this.write = write;
    this.validate = validate;
    this.retries = retries;
    this.handleError = handleError;
    this.logError = logError;
    this.logInfo = logInfo;
    this.retry = retry;
    if (json === false) {
      this.json = false;
    }
    else {
      this.json = true;
    }
    if (!retryCountName || retryCountName.length === 0) {
      this.retryCountName = 'retryCount';
    }
    else {
      this.retryCountName = retryCountName;
    }
    if (limitRetry) {
      this.limitRetry = limitRetry;
    }
    else {
      this.limitRetry = 0;
    }
    this.handle = this.handle.bind(this);
  }
  Handler.prototype.handle = function (data, attributes) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      if (!data) {
        reject(null);
      }
      if (_this.logInfo) {
        _this.logInfo("Received message: " + core_1.toString(data));
      }
      if (typeof data === 'string' && _this.json) {
        try {
          data = JSON.parse(data);
        }
        catch (er0) {
          if (_this.logError) {
            _this.logError('Invalid data: ' + er0);
          }
          return false;
        }
      }
      if (_this.validate) {
        _this.validate(data).then(function (errors) {
          if (errors && errors.length > 0) {
            if (_this.logError) {
              _this.logError("Message is invalid: " + core_1.toString(data, attributes) + " . Error: " + core_1.toString(errors));
            }
            reject(errors);
          }
          else {
            if (_this.retries && _this.retries.length > 0) {
              retry_1.writeWithRetry(data, _this.write, _this.retries, _this.handleError, _this.logError).then(function (res) { resolve(1); }).catch(function (er1) { return reject(er1); });
            }
            else {
              return write_1.write(_this.write, data, attributes, _this.handleError, _this.retry, _this.limitRetry, _this.retryCountName, _this.logError, _this.logInfo);
            }
          }
        });
      }
      else {
        if (_this.retries && _this.retries.length > 0) {
          retry_1.writeWithRetry(data, _this.write, _this.retries, _this.handleError, _this.logError).then(function (res) { resolve(1); }).catch(function (er1) { return reject(er1); });
        }
        else {
          return write_1.write(_this.write, data, attributes, _this.handleError, _this.retry, _this.limitRetry, _this.retryCountName, _this.logError, _this.logInfo);
        }
      }
    });
  };
  return Handler;
}());
exports.Handler = Handler;
