import { Logger } from "tslog";
import { gradient, color } from "ansimax";

const PURPLE_GRADIENT = ["#6a0dad", "#9b59b6", "#d7bde2", "#9b59b6", "#6a0dad"];

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

export function logBanner(text: string): void {
  console.log(gradient(text, PURPLE_GRADIENT));
}
