import { displayDateTime } from "./utils/transform-utils";

export const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // turn off console.log in production
  console.log = () => {};
} else {
  const logger = console.log;
  console.log = (...data) => {
    const dateString = `[${displayDateTime(
      new Date(),
      "DD/MM/YYYY HH:mm:ss:SSS ZZ",
    )}]`;

    let logData = [dateString, ...data];

    const [a, b, ...rest] = data;
    if (typeof a === "string" && a.startsWith("%c")) {
      logData = [`%c%s ${a.substring(2)}`, b, dateString, ...rest];
    }

    logger(...(logData as unknown[]));
  };
}
