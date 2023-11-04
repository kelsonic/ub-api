import winston from 'winston';

const transports: winston.transport[] = [];

transports.push(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }),
);

const logger = winston.createLogger({
  level: 'info',
  transports: transports,
});

export default logger;
