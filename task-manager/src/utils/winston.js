const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

module.exports = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        myFormat
    ),
    defaultMeta: { service: 'task-manager' },
    transports: [
        new transports.File({ filename: `./logs/task_manager_${new Date().toISOString().replace(/:/g, '-').replace('.', '-')}.log` }),
        new transports.Console()
    ],
});

