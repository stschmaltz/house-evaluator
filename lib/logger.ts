const isBrowser = typeof window !== 'undefined';

function truncateObject<T>(obj: T, maxDepth = 8, currentDepth = 0): unknown {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (
    typeof (obj as Record<string, unknown>)._id === 'object' &&
    (obj as Record<string, unknown>)._id !== null &&
    typeof ((obj as Record<string, unknown>)._id as { toString?: () => string })
      .toString === 'function'
  ) {
    return (
      (obj as Record<string, unknown>)._id as { toString: () => string }
    ).toString();
  }

  if (currentDepth >= maxDepth) {
    if (Array.isArray(obj)) {
      return `[Array with ${obj.length} items]`;
    }

    if (
      typeof (obj as { toString?: () => string }).toString === 'function' &&
      (obj as { toString: () => string }).toString() !== '[object Object]'
    ) {
      return (obj as { toString: () => string }).toString();
    }

    return '[Object]';
  }

  const result: Record<string, unknown> | unknown[] = Array.isArray(obj)
    ? []
    : {};

  if (Array.isArray(obj)) {
    const maxItems = 5;
    for (let i = 0; i < Math.min(obj.length, maxItems); i++) {
      (result as unknown[])[i] = truncateObject(
        obj[i],
        maxDepth,
        currentDepth + 1,
      );
    }
    if (obj.length > maxItems) {
      (result as unknown[])[maxItems] =
        `...and ${obj.length - maxItems} more items`;
    }
  } else {
    const keys = Object.keys(obj);
    const maxKeys = 10;
    for (let i = 0; i < Math.min(keys.length, maxKeys); i++) {
      const key = keys[i];
      (result as Record<string, unknown>)[key] = truncateObject(
        (obj as Record<string, unknown>)[key],
        maxDepth,
        currentDepth + 1,
      );
    }
    if (keys.length > maxKeys) {
      (result as Record<string, unknown>)['...'] =
        `and ${keys.length - maxKeys} more keys`;
    }
  }

  return result;
}

interface Logger {
  info: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

const createLogger = (): Logger => {
  if (isBrowser) {
    return {
      info: (message: string, data?: unknown) => {
        console.info(message, data ? truncateObject(data) : '');
      },
      error: (message: string, data?: unknown) => {
        console.error(message, data ? truncateObject(data) : '');
      },
      warn: (message: string, data?: unknown) => {
        console.warn(message, data ? truncateObject(data) : '');
      },
      debug: (message: string, data?: unknown) => {
        console.debug(message, data ? truncateObject(data) : '');
      },
    };
  }

  return {
    info: (message: string, data?: unknown) => {
      console.info(`[INFO] ${message}`, data ? truncateObject(data) : '');
    },
    error: (message: string, data?: unknown) => {
      console.error(`[ERROR] ${message}`, data ? truncateObject(data) : '');
    },
    warn: (message: string, data?: unknown) => {
      console.warn(`[WARN] ${message}`, data ? truncateObject(data) : '');
    },
    debug: (message: string, data?: unknown) => {
      console.debug(`[DEBUG] ${message}`, data ? truncateObject(data) : '');
    },
  };
};

export const logger = createLogger();
