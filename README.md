# tinylogger

[![npm](https://img.shields.io/npm/v/@luca_scorpion/tinylogger)](https://www.npmjs.com/package/@luca_scorpion/tinylogger)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@luca_scorpion/tinylogger)](https://www.npmjs.com/package/@luca_scorpion/tinylogger)

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

Logger.logLevel = LogLevel.DEBUG

const log = new Logger('my-logger');
log.debug('Now you will see me!');
```
