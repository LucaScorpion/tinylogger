# tinylogger

A no-nonsense, dependency-free, minimalistic logger.

## Usage

```js
import { Logger } from '@luca_scorpion/tinylogger';
// or:
// const { Logger } = require('@luca_scorpion/tinylogger');

const log = new Logger('my-logger');
log.debug('You cannot see me, because the default log level is INFO');
log.info('Tell me more, tell me more.');
log.warn('Something might be going on.');
log.error('Panic! Red alert!');
```

The above example will print:

```
2020-09-14T12:41:21.715Z [INFO ] my-logger | Tell me more, tell me more.
2020-09-14T12:41:21.715Z [WARN ] my-logger | Something might be going on.
2020-09-14T12:41:21.715Z [ERROR] my-logger | Panic! Red alert!
```

### Minimum Log Level

The logger will automatically set the global minimum log level based on the `LOG_LEVEL` environment variable. This can also be changed by setting `Logger.logLevel`:

```js
import { Logger, LogLevel } from '@luca_scorpion/tinylogger';

Logger.logLevel = LogLevel.DEBUG

const log = new Logger('my-logger');
log.debug('Now you will see me!');
```
