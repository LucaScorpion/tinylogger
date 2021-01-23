export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

const logLevelNames = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO ',
  [LogLevel.WARN]: 'WARN ',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.OFF]: '',
};

export type LogFunction = (message: string) => void;

export interface LogHandlers {
  [LogLevel.DEBUG]?: LogFunction;
  [LogLevel.INFO]?: LogFunction;
  [LogLevel.WARN]?: LogFunction;
  [LogLevel.ERROR]?: LogFunction;
}

export class Logger {
  /**
   * The minimum log level.
   * All messages below this level are ignored.
   */
  public static logLevel =
    LogLevel[process?.env?.LOG_LEVEL?.toUpperCase() as keyof typeof LogLevel] ??
    LogLevel.INFO;

  /**
   * The maximum length of a logger name, used to pad the logger names when logging.
   * @private
   */
  private static maxNameLength = 0;

  /**
   * The log handlers used when logging messages.
   * @private
   */
  private static handlers: LogHandlers = {
    [LogLevel.DEBUG]: (m) => console.debug(m),
    [LogLevel.INFO]: (m) => console.info(m),
    [LogLevel.WARN]: (m) => console.warn(m),
    [LogLevel.ERROR]: (m) => console.error(m),
  };

  public constructor(private readonly name: string) {
    Logger.maxNameLength = Math.max(Logger.maxNameLength, name.length);
  }

  /**
   * Set the log handler functions.
   * This can either be an object with a function for each log level,
   * or a single function which will then be used for all levels.
   *
   * @param handlers The handler function(s) to use.
   */
  public static setLogHandlers(handlers: LogHandlers | LogFunction): void {
    if (typeof handlers === 'function') {
      // If the handler is a function, use that for all log levels.
      this.handlers = {
        [LogLevel.DEBUG]: handlers,
        [LogLevel.INFO]: handlers,
        [LogLevel.WARN]: handlers,
        [LogLevel.ERROR]: handlers,
      };
    } else {
      this.handlers = handlers;
    }
  }

  private static padName(name: string): string {
    return `${name}${' '.repeat(Logger.maxNameLength - name.length)}`;
  }

  public debug(message: unknown): void {
    this.log(LogLevel.DEBUG, message);
  }

  public info(message: unknown): void {
    this.log(LogLevel.INFO, message);
  }

  public warn(message: unknown): void {
    this.log(LogLevel.WARN, message);
  }

  public error(message: unknown): void {
    this.log(LogLevel.ERROR, message);
  }

  private log(level: LogLevel, message: unknown): void {
    if (level < Logger.logLevel || level == LogLevel.OFF) {
      return;
    }

    const handler = Logger.handlers[level];
    if (handler) {
      handler(
        `${new Date().toISOString()} [${logLevelNames[level]}] ${Logger.padName(
          this.name
        )} | ${message}`
      );
    }
  }
}
