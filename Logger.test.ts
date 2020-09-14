import { Logger, LogLevel } from './Logger';

afterEach(() => {
  Logger.logLevel = LogLevel.INFO;
  jest.clearAllMocks();
});

test('logging prints a message to the console', () => {
  const spy = jest.spyOn(console, 'log');

  const log = new Logger('test');
  log.info('A message');

  expect(spy).toBeCalled();
});

test('prints nothing when the log level is set to OFF', () => {
  Logger.logLevel = LogLevel.OFF;
  const spy = jest.spyOn(console, 'log');

  const log = new Logger('off');
  log.debug('debug');
  log.info('info');
  log.warn('warn');
  log.error('error');

  expect(spy).not.toBeCalled();
});
