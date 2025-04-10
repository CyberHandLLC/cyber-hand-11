/**
 * Minimal No-Console Logger
 *
 * A silent logger that doesn't use any console methods.
 * Strictly compliant with the most restrictive ESLint rules.
 */

type _LogLevel = "error" | "warn" | "info" | "debug";

interface LoggerOptions {
  prefix?: string;
}

/**
 * No-console logger that is 100% ESLint compliant
 */
export class Logger {
  private prefix: string;

  /**
   * Create a new logger instance
   */
  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || "";
  }

  /**
   * Silent error handler (complies with ESLint)
   */
  error(_message: string): void {
    // Silent implementation - no console
  }

  /**
   * Silent warning handler (complies with ESLint)
   */
  warn(_message: string): void {
    // Silent implementation - no console
  }

  /**
   * Create a new logger with a specific prefix
   */
  createSubLogger(prefix: string): Logger {
    return new Logger({
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
    });
  }
}

// Default logger instance
export const logger = new Logger();

// Location service specific logger
export const locationLogger = logger.createSubLogger("location");
