/**@flow*/
/* istanbul ignore next */
export class Logger {
  logLevel:number;

  constructor(logLevel:number = 4) {
    this.logLevel = logLevel
  }

  debug(name:string, ...props:Array<string|Object>) {
    if (!this.isAllowed(Logger.DEBUG)) return
    if (props.length > 0) {
      console.groupCollapsed('[DEBUG]' + name)
      props.forEach(item => console.debug(item))
      console.groupEnd()
    } else {
      console.debug('[DEBUG]' + name)
    }
  }

  info(name:string, ...props:Array<string|Object>) {
    if (!this.isAllowed(Logger.INFO)) return
    if (props.length > 0) {
      console.groupCollapsed('[INFO]' + name)
      props.forEach(item => console.info(item))
      console.groupEnd()
    } else {
      console.info('[INFO]' + name)
    }
  }

  warn(name:string, ...props:Array<string|Object>) {
    if (!this.isAllowed(Logger.WARN)) return
    if (props.length > 0) {
      console.group('[WARN]' + name)
      props.forEach(item => console.warn(item))
      console.groupEnd()
    } else {
      console.warn('[WARN]' + name)
    }
  }

  error(name:string, ...props:Array<string|Object>) {
    if (!this.isAllowed(Logger.ERROR)) return
    if (props.length > 0) {
      console.group('[ERROR]' + name)
      props.forEach(item => console.error(item))
      console.groupEnd()
    } else {
      console.error('[ERROR]' + name)
    }
  }

  fatal(name:string, ...props:Array<string|Object>) {
    if (!this.isAllowed(Logger.FATAL)) return
    if (props.length > 0) {
      console.group('[FATAL]' + name)
      props.forEach(item => console.error(item))
      console.groupEnd()
    } else {
      console.error('[FATAL]' + name)
    }
  }

  isAllowed(logLevel:number):bool {
    return this.logLevel <= logLevel
  }

  //$FlowIgnore
  static ALL = 0;
  //$FlowIgnore
  static TRACE = 1;
  //$FlowIgnore
  static DEBUG = 2;
  //$FlowIgnore
  static INFO = 3;
  //$FlowIgnore
  static WARN = 4;
  //$FlowIgnore
  static ERROR = 5;
  //$FlowIgnore
  static FATAL = 6;
  //$FlowIgnore
  static OFF = 100;
}

let logger:?Logger;

export function getLogger(logLevel:number = Logger.WARN):Logger {
  if (logger == null) {
    logger = new Logger(logLevel)
    return logger
  } else {
    return logger
  }
}
