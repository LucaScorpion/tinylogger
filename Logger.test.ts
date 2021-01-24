import { Logger, LogHandlers, LogLevel } from './Logger';

afterEach(() => {
  Logger.logLevel = LogLevel.INFO;
  jest.clearAllMocks();
});

describe('Logger', (): void => {
  test('default handlers print to the console', () => {
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();

    Logger.logLevel = LogLevel.DEBUG;
    const log = new Logger('test');
    log.debug('Debug');
    log.info('Info');
    log.warn('Warn');
    log.error('Error');

    expect(console.debug).toBeCalledWith(
      expect.stringContaining(' [DEBUG] test | Debug')
    );
    expect(console.info).toBeCalledWith(
      expect.stringContaining(' [INFO ] test | Info')
    );
    expect(console.warn).toBeCalledWith(
      expect.stringContaining(' [WARN ] test | Warn')
    );
    expect(console.error).toBeCalledWith(
      expect.stringContaining(' [ERROR] test | Error')
    );
  });

  test('logging invokes the log handlers', () => {
    const handlers: LogHandlers = {
      [LogLevel.DEBUG]: jest.fn(),
      [LogLevel.INFO]: jest.fn(),
      [LogLevel.WARN]: jest.fn(),
      [LogLevel.ERROR]: jest.fn(),
    };
    Logger.logLevel = LogLevel.DEBUG;
    Logger.setLogHandlers(handlers);

    const log = new Logger('test');
    log.debug('Debug');
    log.info('Info');
    log.warn('Warn');
    log.error('Error');

    expect(handlers[LogLevel.DEBUG]).toBeCalledWith(
      expect.stringContaining(' [DEBUG] test | Debug')
    );
    expect(handlers[LogLevel.INFO]).toBeCalledWith(
      expect.stringContaining(' [INFO ] test | Info')
    );
    expect(handlers[LogLevel.WARN]).toBeCalledWith(
      expect.stringContaining(' [WARN ] test | Warn')
    );
    expect(handlers[LogLevel.ERROR]).toBeCalledWith(
      expect.stringContaining(' [ERROR] test | Error')
    );
  });

  test('prints nothing when the log level is set to OFF', () => {
    Logger.logLevel = LogLevel.OFF;
    const handler = jest.fn();
    Logger.setLogHandlers(handler);

    const log = new Logger('test');
    log.debug('Debug');
    log.info('Info');
    log.warn('Warn');
    log.error('Error');

    expect(handler).not.toBeCalled();
  });

  test('uses a single function as log handler', () => {
    Logger.logLevel = LogLevel.DEBUG;
    const handler = jest.fn();
    Logger.setLogHandlers(handler);

    const log = new Logger('test');
    log.debug('Debug');
    log.info('Info');
    log.warn('Warn');
    log.error('Error');

    expect(handler).toBeCalledWith(
      expect.stringContaining(' [DEBUG] test | Debug')
    );
    expect(handler).toBeCalledWith(
      expect.stringContaining(' [INFO ] test | Info')
    );
    expect(handler).toBeCalledWith(
      expect.stringContaining(' [WARN ] test | Warn')
    );
    expect(handler).toBeCalledWith(
      expect.stringContaining(' [ERROR] test | Error')
    );
  });

  test('calls all log handlers', () => {
    const allHandler = jest.fn();
    const errorHandler = { [LogLevel.ERROR]: jest.fn() };
    Logger.setLogHandlers(allHandler, errorHandler);

    const log = new Logger('test');
    log.info('Info');
    log.error('Error');

    expect(allHandler).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(' [INFO ] test | Info')
    );
    expect(allHandler).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(' [ERROR] test | Error')
    );
    expect(errorHandler[LogLevel.ERROR]).toBeCalledWith(
      expect.stringContaining(' [ERROR] test | Error')
    );
  });
});
