import morgan, { StreamOptions } from "morgan";
import logger from ".";

const stream: StreamOptions = {
  write: (message) => logger.http("Request", JSON.parse(message)),
};

const morganMiddleware = morgan(
  JSON.stringify({
    method: ":method",
    url: ":url",
    "response-time": ":response-time ms",
    status: ":status",
  }),
  { stream },
);

export default morganMiddleware;
