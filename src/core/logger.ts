import { Logger } from "tslog";
import { color } from "ansimax";

const logger = new Logger({ minLevel: "WARN", type: "json" });

export function logSuccess(message: string): void {
  logger.info(`${color.green("[SUCCESS]")} ${message}`);
}

export function logError(message: string): void {
  logger.error(`${color.red("[ERROR]")} ${message}`);
}

export function logInfo(message: string): void {
  logger.info(`${color.cyan("[INFO]")} ${message}`);
}

export function logStep(message: string): void {
  console.log(`${color.magenta("→")} ${message}`);
}
