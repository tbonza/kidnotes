import winston, { format } from 'winston';

// Set up logging
const { combine, timestamp, label, printf } = winston.format;

const timezoneUTC = () => {
  return new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
}

export const logger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: timezoneUTC }), 
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console(),
  ]
});
