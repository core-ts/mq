import { StringMap, toString } from './core';

export async function writeWithRetry<T>(t: T, writeT: (x: T) => Promise<number>, retries: number[], handleError?: (data: T, header?: StringMap) => Promise<void>, logError?: (msg: string) => void): Promise<number> {
  const l = retries.length;
  const l1 = l - 1;
  let i = 0;
  let flag = true;
  let error: any;
  while (flag) {
    try {
      const res = await writeT(t);
      if (logError && i > 0) {
        logError(`Write successfully after ${i} retries: ${toString(t)}`);
      }
      error = null;
      return res;
    } catch (err) {
      error = err;
      if (i >= l1) {
        flag = false;
        if (logError) {
          logError(`Failed to write after ${i} retries: ${toString(t)}. Error: ${toString(err)}`);
        }
        if (handleError) {
          handleError(t);
        }
        break;
      } else {
        if (logError) {
          logError(`Retrying ${i + 1} of ${l} after error: ${err}`);
        }
        await new Promise(res => setTimeout(res, retries[i]));
      }
    }
    i++;
  }
  if (error) {
    throw new Error(`after ${l} attempts, last error: ${error}`);
  }
  return 0;
}

export class RetryWriter<T> {
  writeTo: (data: T) => Promise<number>;
  constructor(
      writeT: (data: T) => Promise<number>,
      public retries: number[],
      public writeError?: (data: T) => Promise<number>,
      public logError?: (msg: string) => void,
  ) {
    this.writeTo = writeT;
    this.write = this.write.bind(this);
  }
  write(data: T): Promise<number> {
    return writeTo(data, this.writeTo, this.retries, this.writeError, this.logError);
  }
}
export async function writeTo<T>(t: T, writeT: (x: T) => Promise<number>, retries?: number[], writeError?: (x: T) => Promise<number>, logError?: (msg: string) => void): Promise<number> {
  if (!retries || retries.length === 0) {
    return writeT(t).then(r => r).catch(err => {
      if (logError && err) {
        logError('Error: ' + toString(err));
      }
      if (writeError) {
        return writeError(t);
      } else {
        throw err;
      }
    });
  } else {
    const l = retries.length;
    const l1 = l - 1;
    let i = 0;
    let flag = true;
    let error: any;
    while (flag) {
      try {
        const res = await writeT(t);
        if (logError && i > 0) {
          logError(`Write successfully after ${i} retries: ${toString(t)}`);
        }
        error = null;
        return res;
      } catch (err) {
        error = err;
        if (i >= l1) {
          flag = false;
          if (logError) {
            logError(`Failed to write after ${i} retries: ${toString(t)}. Error: ${toString(err)}`);
          }
          if (writeError) {
            return writeError(t);
          }
          break;
        } else {
          if (logError) {
            logError(`Retrying ${i + 1} of ${l} after error: ${err}`);
          }
          await new Promise(res => setTimeout(res, retries[i]));
        }
      }
      i++;
    }
    if (error) {
      throw new Error(`after ${l} attempts, last error: ${error}`);
    }
    return 0;
  }
}

export class RetrySender<T, R> {
  sendTo: (data: T, attributes?: StringMap) => Promise<R>;
  constructor(
      sendT: (data: T, attributes?: StringMap) => Promise<R>,
      public retries: number[],
      public writeError?: (data: T, attributes?: StringMap) => Promise<R>,
      public logError?: (msg: string) => void,
  ) {
    this.sendTo = sendT;
    this.send = this.send.bind(this);
  }
  send(data: T, attributes?: StringMap): Promise<R> {
    return send(data, this.sendTo, this.retries, this.writeError, this.logError);
  }
}
export async function send<T, R>(t: T, writeT: (data: T, attributes?: StringMap) => Promise<R>, retries?: number[], writeError?: (data: T, attributes?: StringMap) => Promise<R>, logError?: (msg: string) => void): Promise<R> {
  if (!retries || retries.length === 0) {
    return writeT(t).then(r => r).catch(err => {
      if (logError && err) {
        logError('Error: ' + toString(err));
      }
      if (writeError) {
        return writeError(t);
      } else {
        throw err;
      }
    });
  } else {
    const l = retries.length;
    const l1 = l - 1;
    let i = 0;
    let flag = true;
    let error: any;
    while (flag) {
      try {
        const res = await writeT(t);
        if (logError && i > 0) {
          logError(`Write successfully after ${i} retries: ${toString(t)}`);
        }
        error = null;
        return res;
      } catch (err) {
        error = err;
        if (i >= l1) {
          flag = false;
          if (logError) {
            logError(`Failed to write after ${i} retries: ${toString(t)}. Error: ${toString(err)}`);
          }
          if (writeError) {
            return writeError(t);
          }
          break;
        } else {
          if (logError) {
            logError(`Retrying ${i + 1} of ${l} after error: ${err}`);
          }
          await new Promise(res => setTimeout(res, retries[i]));
        }
      }
      i++;
    }
    if (error) {
      throw new Error(`after ${l} attempts, last error: ${error}`);
    }
    return '' as any;
  }
}
