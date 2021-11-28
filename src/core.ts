export interface StringMap {
  [key: string]: string;
}
export interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
}
export interface NumberMap {
  [key: number]: number;
}
export function createRetry(obj?: NumberMap): number[] {
  const r: number[] = [];
  if (!obj) {
    return r;
  }
  const max = 200;
  for (let i = 1; i <= max; i++) {
    const v = obj[i];
    if (v && typeof v === 'number') {
      r.push(v);
    } else {
      return r;
    }
  }
  return r;
}
export function toString(v: any, attributes?: StringMap): string {
  if (attributes) {
    const ks = Object.keys(attributes);
    if (ks.length > 0) {
      if (typeof v === 'string') {
        return v + ' ' + JSON.stringify(attributes);
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
  constructor(private send: (data: T, attributes?: StringMap) => Promise<R>, public logError?: (msg: string) => void, public logInfo?: (msg: string) => void) {
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
export class ErrorHandler<T> {
  constructor(public logError?: (msg: string) => void) {
    this.error = this.error.bind(this);
  }
  error(data: T, header?: StringMap): Promise<void> {
    if (data && this.logError) {
      this.logError(`Fail to consume message: ` + toString(data, header));
    }
    return new Promise(resolve => resolve());
  }
}
