export interface StringMap {
  [key: string]: string;
}
export interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
}
export function toString(v: any, attributes?: StringMap): string {
  if (attributes) {
    const ks = Object.keys(attributes);
    if (ks.length > 0) {
      if (typeof v === 'string') {
        return v + JSON.stringify(attributes);
      } else {
        return JSON.stringify(v) + ' ' + JSON.stringify(attributes);
      }
    } else {
      return ts(v);
    }
  } else {
    return ts(v);
  }
}
function ts(v: any): string {
  if (typeof v === 'string') {
    return v;
  } else {
    return JSON.stringify(v);
  }
}
export class RetryService<T, R> {
  constructor(private send: (data: T, attributes?: StringMap) => Promise<R>, public logError?: (msg: any) => void, public logInfo?: (msg: any) => void) {
    this.retry = this.retry.bind(this);
  }
  retry(data: T, header?: StringMap): Promise<R> {
    return this.send(data, header).then(res => {
      if (this.logInfo) {
        this.logInfo(`Retry put to mq success.`);
      }
      return res;
    }).catch(err => {
      if (this.logError) {
        this.logError(`Retry put to mq error: ` + toString(err));
      }
      throw err;
    });
  }
}
declare let promiseFunc: () => Promise<void>;
export class ErrorHandler<T> {
  constructor(public logError?: (msg: any) => void, public logInfo?: (msg: any) => void) {
    this.error = this.error.bind(this);
  }
  error(data: T, header?: StringMap): Promise<void> {
    if (data && this.logError) {
      this.logError(`Fail to consume message: ` + toString(data, header));
    }
    return new Promise(resolve => resolve());
  }
}
