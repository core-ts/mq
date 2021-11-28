import { StringMap, toString } from './core';

export async function write<T, R>(writeTo: (data: T) => Promise<number>, data: T, attributes?: StringMap | undefined, handleError?: (data: T, header?: StringMap) => Promise<void>, retry?: (data: T, header?: StringMap) => Promise<R>, limitRetry?: number, retryCountName?: string, logError?: (msg: string) => void, logInfo?: (msg: string) => void): Promise<number> {
  try {
    const r = await writeTo(data);
    return r;
  } catch (er1) {
    if (logError) {
      logError(`Fail to write ${toString(data)} . Error: ${toString(er1)}`);
    }
    if (!retry) {
      if (handleError) {
        await handleError(data, attributes);
      }
      throw er1;
    }
    let retryCount = 0;
    if (!retryCountName) {
      retryCountName = 'retryCount';
    }
    if (!limitRetry) {
      limitRetry = 0;
    }
    if (!attributes) {
      attributes = {};
    }
    const s = attributes[retryCountName];
    if (s && !isNaN(s as any)) {
      retryCount = Number(s);
    }
    retryCount++;
    if (retryCount > limitRetry) {
      if (logInfo) {
        logInfo(`No more retry. Retry limitation: ${limitRetry} . Message: ${toString(data, attributes)}.`);
      }
      if (handleError) {
        await handleError(data, attributes);
        throw er1;
      } else {
        throw er1;
      }
    } else {
      if (logInfo) {
        logInfo(`Retry: ${retryCount} . Message: ${toString(data, attributes)}.`);
      }
      attributes[retryCountName] = retryCount.toString();
      try {
        await retry(data, attributes);
        return 0;
      } catch (er2) {
        if (logError) {
          logError(`Cannot retry ${toString(data, attributes)} . Error: ${toString(er1)}.`);
        }
        throw er2;
      }
    }
  }
}
