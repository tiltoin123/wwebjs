import { createLogger, format, transports } from "winston";

const getLevel = () => {
  switch (process.env.NODE_ENV) {
    case "local":
      return "silly";

    case "development":
      return "debug";

    default:
      return "http";
  }
};

const letterCase = format((info) => {
  const newInfo = { ...info };
  newInfo.level = info.level.toUpperCase();

  return newInfo;
});

const customFormat = format.combine(
  letterCase(),
  format.colorize({ level: true }),
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.metadata({
    fillExcept: ["level", "timestamp", "message"],
  }),
  format.printf((info) => {
    const {
      level, timestamp, message, metadata,
    } = info;
    const metadataPrinted = Object.keys(metadata).length > 0 ? `| metadata: ${JSON.stringify(metadata)}` : "";

    const logStringFormat = ` ${timestamp} | [${level}] -> ${message} ${metadataPrinted}`;

    return logStringFormat;
  }),
);

const customTransports = [
  new transports.Console(),
  new transports.File({
    filename: "logs/error.log",
    level: "error",
    format: format.uncolorize(),
  }),
  new transports.File({
    filename: "logs/all.log",
    format: format.uncolorize(),
  }),
];

const logger = createLogger({
  level: getLevel(),
  format: customFormat,
  transports: customTransports,
  exitOnError: false,
  silent: process.env.NODE_ENV === "test",
});

export default logger;
