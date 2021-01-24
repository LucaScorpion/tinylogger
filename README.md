# tinylogger

[![npm](https://img.shields.io/npm/v/@luca_scorpion/tinylogger)](https://www.npmjs.com/package/@luca_scorpion/tinylogger)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@luca_scorpion/tinylogger)](https://www.npmjs.com/package/@luca_scorpion/tinylogger)
[![tests](https://github.com/LucaScorpion/tinylogger/workflows/Test/badge.svg)](https://github.com/LucaScorpion/tinylogger/actions?query=workflow%3ATest)
[![dependencies](https://david-dm.org/LucaScorpion/tinylogger.svg)](https://david-dm.org/LucaScorpion/tinylogger)

A no-nonsense, dependency-free, minimalistic logger.

## Usage

```js
const { Logger } = require('@luca_scorpion/tinylogger');
// or:
// import { Logger } from '@luca_scorpion/tinylogger';

const log = new Logger('my-log');
const anotherLog = new Logger('another-logger');

log.debug('You cannot see me, because the default log level is INFO');
log.info('Tell me more, tell me more.');

anotherLog.warn('Something might be going on.');
anotherLog.error('Panic! Red alert!');
```

The above example will print:

```
2020-09-14T13:23:50.508Z [INFO ] my-log         | Tell me more, tell me more.
2020-09-14T13:23:50.510Z [WARN ] another-logger | Something might be going on.
2020-09-14T13:23:50.510Z [ERROR] another-logger | Panic! Red alert!
```

### Minimum Log Level

The logger will automatically set the global minimum log level based on the `LOG_LEVEL` environment variable. This can also be changed by setting `Logger.logLevel`:

```js
import { Logger, LogLevel } from '@luca_scorpion/tinylogger';

Logger.logLevel = LogLevel.DEBUG;

const log = new Logger('my-logger');
log.debug('Now you will see me!');
```

### Custom Logging Handlers

By default, all messages will be logged to the console. One or more custom handlers can be set for each level using `Logger.setLogHandlers`:

```js
import { Logger, LogLevel } from '@luca_scorpion/tinylogger';

const handleLog = (message: string) => {};
const handleError = (message: string) => {};

Logger.setLogHandlers({
  [LogLevel.INFO]: handleLog,
  [LogLevel.WARN]: handleLog,
  [LogLevel.ERROR]: handleError,
});
```

If a handler is not defined for a log level, it will be ignored.

Alternatively, you can also pass a single handler to use for all levels:

```js
import { Logger } from '@luca_scorpion/tinylogger';

const handleLog = (message: string) => {};

Logger.setLogHandlers(handleLog);
```

You can also pass multiple handlers, for example to handle error messages differently:

```js
import { Logger, LogLevel, getConsoleLogHandlers } from '@luca_scorpion/tinylogger';

const handleError = {
  [LogLevel.ERROR]: (message: string) => {}
};

Logger.setLogHandlers(getConsoleLogHandlers(), handleError);
```

The `getConsoleLogHandlers` function returns (a copy of) the console handlers which are used by default.
