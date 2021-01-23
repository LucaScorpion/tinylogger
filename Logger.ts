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
  private static handlers: LogHandlers[] = [
    {
      [LogLevel.DEBUG]: (m) => console.debug(m),
      [LogLevel.INFO]: (m) => console.info(m),
      [LogLevel.WARN]: (m) => console.warn(m),
      [LogLevel.ERROR]: (m) => console.error(m),
    },
  ];

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
  public static setLogHandlers(
    ...handlers: (LogHandlers | LogFunction)[]
  ): void {
    const newHandlers: LogHandlers[] = [];

    handlers.forEach((h) => {
      if (typeof h === 'function') {
        // If the handler is a function, use that for all log levels.
        newHandlers.push({
          [LogLevel.DEBUG]: h,
          [LogLevel.INFO]: h,
          [LogLevel.WARN]: h,
          [LogLevel.ERROR]: h,
        });
      } else {
        newHandlers.push(h);
      }
    });

    this.handlers = newHandlers;
  }

  private static padName(name: string): string {
    return `${name}${' '.repeat(Logger.maxNameLength - name.length)}`;
  }

  /**
   * Log a debug message.
   *
   * @param message The message to log.
   */
  public debug(message: unknown): void {
    this.log(LogLevel.DEBUG, message);
  }

  /**
   * Log an info message.
   *
   * @param message The message to log.
   */
  public info(message: unknown): void {
    this.log(LogLevel.INFO, message);
  }

  /**
   * Log a warning message.
   *
   * @param message The message to log.
   */
  public warn(message: unknown): void {
    this.log(LogLevel.WARN, message);
  }

  /**
   * Log an error message.
   *
   * @param message The message to log.
   */
  public error(message: unknown): void {
    this.log(LogLevel.ERROR, message);
  }

  /**
   * Log a message with the given log level.
   * If the log level is {@link LogLevel.OFF} or lower than {@link Logger.logLevel}
   * the message will be ignored.
   *
   * @param level The log level.
   * @param message The message to log.
   * @private
   */
  private log(level: LogLevel, message: unknown): void {
    if (level < Logger.logLevel || level == LogLevel.OFF) {
      return;
    }

    Logger.handlers.forEach((h) => {
      const levelHandler = h[level];
      if (levelHandler) {
        levelHandler(
          `${new Date().toISOString()} [${
            logLevelNames[level]
          }] ${Logger.padName(this.name)} | ${message}`
        );
      }
    });
  }
}
