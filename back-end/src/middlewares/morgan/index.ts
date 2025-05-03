import morgan, { StreamOptions } from "morgan";

import Logger from "../../common/utility/logger";

const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Logger.http(message),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const morganMiddleware = morgan(
    ":method :url :status - :response-time ms",
    { stream, skip }
);

export default morganMiddleware;