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
function write(writeTo, data, attributes, handleError, retry, limitRetry, retryCountName, logError, logInfo) {
  return __awaiter(this, void 0, void 0, function () {
    var r, er1_1, retryCount, s, er2_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 14]);
          return [4, writeTo(data)];
        case 1:
          r = _a.sent();
          return [2, r];
        case 2:
          er1_1 = _a.sent();
          if (logError) {
            logError("Fail to write " + core_1.toString(data) + " . Error: " + core_1.toString(er1_1));
          }
          if (!!retry) return [3, 5];
          if (!handleError) return [3, 4];
          return [4, handleError(data, attributes)];
        case 3:
          _a.sent();
          _a.label = 4;
        case 4: throw er1_1;
        case 5:
          retryCount = 0;
          if (!retryCountName) {
            retryCountName = 'retryCount';
          }
          if (!limitRetry) {
            limitRetry = 0;
          }
          if (!attributes) {
            attributes = {};
          }
          s = attributes[retryCountName];
          if (s && !isNaN(s)) {
            retryCount = Number(s);
          }
          retryCount++;
          if (!(retryCount > limitRetry)) return [3, 9];
          if (logInfo) {
            logInfo("No more retry. Retry limitation: " + limitRetry + " . Message: " + core_1.toString(data, attributes) + ".");
          }
          if (!handleError) return [3, 7];
          return [4, handleError(data, attributes)];
        case 6:
          _a.sent();
          throw er1_1;
        case 7: throw er1_1;
        case 8: return [3, 13];
        case 9:
          if (logInfo) {
            logInfo("Retry: " + retryCount + " . Message: " + core_1.toString(data, attributes) + ".");
          }
          attributes[retryCountName] = retryCount.toString();
          _a.label = 10;
        case 10:
          _a.trys.push([10, 12, , 13]);
          return [4, retry(data, attributes)];
        case 11:
          _a.sent();
          return [2, 0];
        case 12:
          er2_1 = _a.sent();
          if (logError) {
            logError("Cannot retry " + core_1.toString(data, attributes) + " . Error: " + core_1.toString(er1_1) + ".");
          }
          throw er2_1;
        case 13: return [3, 14];
        case 14: return [2];
      }
    });
  });
}
exports.write = write;
