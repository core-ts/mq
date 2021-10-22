import { ErrorMessage, StringMap, toString } from './core';
import { writeWithRetry as retry2 } from './retry';
import { write as writeTo } from './write';

export class Handler<T, R> {
  constructor(
      public write: (data: T) => Promise<number>,
      public validate?: (obj: T) => Promise<ErrorMessage[]>,
      public retries?: number[],
      public handleError?: (obj: T, header?: StringMap) => Promise<void>,
      public logError?: (msg: any) => void,
      public logInfo?: (msg: any) => void,
      public retry?: (data: T, header?: StringMap) => Promise<R>,
      limitRetry?: number,
      retryCountName?: string,
      json?: boolean) {
    if (json === false) {
      this.json = false;
    } else {
      this.json = true;
    }
    if (!retryCountName || retryCountName.length === 0) {
      this.retryCountName = 'retryCount';
    } else {
      this.retryCountName = retryCountName;
    }
    if (limitRetry) {
      this.limitRetry = limitRetry;
    } else {
      this.limitRetry = 0;
    }
    this.handle = this.handle.bind(this);
  }
  json?: boolean;
  retryCountName: string;
  limitRetry: number;
  handle(data: T, attributes?: StringMap): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!data) {
        reject(null);
      }
      if (this.logInfo) {
        this.logInfo(`Received message: ${toString(data)}`);
      }
      if (typeof data === 'string' && this.json) {
        try {
          data = JSON.parse(data);
        } catch (er0) {
          if (this.logError) {
            this.logError('Invalid data: ' + er0);
          }
          return false;
        }
      }
      if (this.validate) {
        this.validate(data).then(errors => {
          if (errors && errors.length > 0) {
            if (this.logError) {
              this.logError(`Message is invalid: ${toString(data, attributes)} . Error: ${toString(errors)}`);
            }
            reject(errors);
          } else {
            if (this.retries && this.retries.length > 0) {
              retry2<T>(data, this.write, this.retries, this.handleError, this.logError).then((res) => { resolve(1); }).catch(er1 => reject(er1));
            } else {
              return writeTo<T, R>(this.write, data, attributes, this.handleError, this.retry, this.limitRetry, this.retryCountName, this.logError, this.logInfo);
            }
          }
        });
      } else {
        if (this.retries && this.retries.length > 0) {
          retry2<T>(data, this.write, this.retries, this.handleError, this.logError).then((res) => { resolve(1); }).catch(er1 => reject(er1));
        } else {
          return writeTo<T, R>(this.write, data, attributes, this.handleError, this.retry, this.limitRetry, this.retryCountName, this.logError, this.logInfo);
        }
      }
    });
  }
}
