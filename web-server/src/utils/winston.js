const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = createLogger({
    level: 'debug',
    format: combine(
        label({ label: 'web-server-app' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: './logs/app.log' }),
        new transports.Console()
    ],
});

