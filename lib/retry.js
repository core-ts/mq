"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function writeWithRetry(t, writeT, retries, handleError, logError) {
  return __awaiter(this, void 0, void 0, function () {
    var l, l1, i, flag, error, res, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          l = retries.length;
          l1 = l - 1;
          i = 0;
          flag = true;
          _a.label = 1;
        case 1:
          if (!flag) return [3, 9];
          _a.label = 2;
        case 2:
          _a.trys.push([2, 4, , 8]);
          return [4, writeT(t)];
        case 3:
          res = _a.sent();
          if (logError && i > 0) {
            logError("Write successfully after " + i + " retries: " + core_1.toString(t));
          }
          error = null;
          return [2, res];
        case 4:
          err_1 = _a.sent();
          error = err_1;
          if (!(i >= l1)) return [3, 5];
          flag = false;
          if (logError) {
            logError("Failed to write after " + i + " retries: " + core_1.toString(t) + ". Error: " + core_1.toString(err_1));
          }
          if (handleError) {
            handleError(t);
          }
          return [3, 9];
        case 5:
          if (logError) {
            logError("Retrying " + (i + 1) + " of " + l + " after error: " + err_1);
          }
          return [4, new Promise(function (res) { return setTimeout(res, retries[i]); })];
        case 6:
          _a.sent();
          _a.label = 7;
        case 7: return [3, 8];
        case 8:
          i++;
          return [3, 1];
        case 9:
          if (error) {
            throw new Error("after " + l + " attempts, last error: " + error);
          }
          return [2, 0];
      }
    });
  });
}
exports.writeWithRetry = writeWithRetry;
var RetryWriter = (function () {
  function RetryWriter(writeT, retries, writeError, logError) {
    this.retries = retries;
    this.writeError = writeError;
    this.logError = logError;
    this.writeTo = writeT;
    this.write = this.write.bind(this);
  }
  RetryWriter.prototype.write = function (data) {
    return writeTo(data, this.writeTo, this.retries, this.writeError, this.logError);
  };
  return RetryWriter;
}());
exports.RetryWriter = RetryWriter;
function writeTo(t, writeT, retries, writeError, logError) {
  return __awaiter(this, void 0, void 0, function () {
    var l, l1, i_1, flag, error, res, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(!retries || retries.length === 0)) return [3, 1];
          return [2, writeT(t).then(function (r) { return r; }).catch(function (err) {
            if (logError && err) {
              logError('Error: ' + core_1.toString(err));
            }
            if (writeError) {
              return writeError(t);
            }
            else {
              throw err;
            }
          })];
        case 1:
          l = retries.length;
          l1 = l - 1;
          i_1 = 0;
          flag = true;
          error = void 0;
          _a.label = 2;
        case 2:
          if (!flag) return [3, 10];
          _a.label = 3;
        case 3:
          _a.trys.push([3, 5, , 9]);
          return [4, writeT(t)];
        case 4:
          res = _a.sent();
          if (logError && i_1 > 0) {
            logError("Write successfully after " + i_1 + " retries: " + core_1.toString(t));
          }
          error = null;
          return [2, res];
        case 5:
          err_2 = _a.sent();
          error = err_2;
          if (!(i_1 >= l1)) return [3, 6];
          flag = false;
          if (logError) {
            logError("Failed to write after " + i_1 + " retries: " + core_1.toString(t) + ". Error: " + core_1.toString(err_2));
          }
          if (writeError) {
            return [2, writeError(t)];
          }
          return [3, 10];
        case 6:
          if (logError) {
            logError("Retrying " + (i_1 + 1) + " of " + l + " after error: " + err_2);
          }
          return [4, new Promise(function (res) { return setTimeout(res, retries[i_1]); })];
        case 7:
          _a.sent();
          _a.label = 8;
        case 8: return [3, 9];
        case 9:
          i_1++;
          return [3, 2];
        case 10:
          if (error) {
            throw new Error("after " + l + " attempts, last error: " + error);
          }
          return [2, 0];
      }
    });
  });
}
exports.writeTo = writeTo;
var RetrySender = (function () {
  function RetrySender(sendT, retries, writeError, logError) {
    this.retries = retries;
    this.writeError = writeError;
    this.logError = logError;
    this.sendTo = sendT;
    this.send = this.send.bind(this);
  }
  RetrySender.prototype.send = function (data, attributes) {
    return send(data, this.sendTo, this.retries, this.writeError, this.logError);
  };
  return RetrySender;
}());
exports.RetrySender = RetrySender;
function send(t, writeT, retries, writeError, logError) {
  return __awaiter(this, void 0, void 0, function () {
    var l, l1, i_2, flag, error, res, err_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(!retries || retries.length === 0)) return [3, 1];
          return [2, writeT(t).then(function (r) { return r; }).catch(function (err) {
            if (logError && err) {
              logError('Error: ' + core_1.toString(err));
            }
            if (writeError) {
              return writeError(t);
            }
            else {
              throw err;
            }
          })];
        case 1:
          l = retries.length;
          l1 = l - 1;
          i_2 = 0;
          flag = true;
          error = void 0;
          _a.label = 2;
        case 2:
          if (!flag) return [3, 10];
          _a.label = 3;
        case 3:
          _a.trys.push([3, 5, , 9]);
          return [4, writeT(t)];
        case 4:
          res = _a.sent();
          if (logError && i_2 > 0) {
            logError("Write successfully after " + i_2 + " retries: " + core_1.toString(t));
          }
          error = null;
          return [2, res];
        case 5:
          err_3 = _a.sent();
          error = err_3;
          if (!(i_2 >= l1)) return [3, 6];
          flag = false;
          if (logError) {
            logError("Failed to write after " + i_2 + " retries: " + core_1.toString(t) + ". Error: " + core_1.toString(err_3));
          }
          if (writeError) {
            return [2, writeError(t)];
          }
          return [3, 10];
        case 6:
          if (logError) {
            logError("Retrying " + (i_2 + 1) + " of " + l + " after error: " + err_3);
          }
          return [4, new Promise(function (res) { return setTimeout(res, retries[i_2]); })];
        case 7:
          _a.sent();
          _a.label = 8;
        case 8: return [3, 9];
        case 9:
          i_2++;
          return [3, 2];
        case 10:
          if (error) {
            throw new Error("after " + l + " attempts, last error: " + error);
          }
          return [2, ''];
      }
    });
  });
}
exports.send = send;
