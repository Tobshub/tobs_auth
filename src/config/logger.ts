import pino from "pino";

const LOG = pino({ transport: { target: "pino-pretty" } });
const env = process.env.NODE_ENV;

const logger = {
  info: (obj: any, msg?: any, ...args: any) => LOG.info(obj, msg, ...args),
  error: (obj: any, msg?: any, ...args: any) => LOG.error(obj, msg, ...args),
  warn: (obj: any, msg?: any, ...args: any) =>
    !env || env === "development" ? LOG.warn(obj, msg, ...args) : null,
};

export default logger;
