import { createLogger, transports, format } from 'winston';


/**
 * Logger Utility Class using Winston.
 * 
 * This class provides various logging levels (info, warn, error, debug, etc.) 
 * using the Winston logging library.
 * 
 * Example usage:
 * - logger.info('Informational message');
 * - logger.error('Error message');
 * - logger.debug('Debugging message');
 * 
 * Logs are recorded to the console and can be extended to log to files or external systems.
 */

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/saucedemo.log' }),
  ],
});