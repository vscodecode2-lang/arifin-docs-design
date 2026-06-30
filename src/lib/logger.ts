/**
 * Logger abstraction untuk Arifin Docs & Design.
 *
 * Menggantikan console.log / console.error langsung di seluruh codebase.
 * - Development : log semua level ke console
 * - Production  : hanya log warn & error; siap untuk diarahkan ke Sentry
 *
 * CARA PAKAI:
 *   import { logger } from "@/lib/logger";
 *   logger.info("Order created", { orderCode });
 *   logger.error("DB insert failed", error);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: unknown;
  timestamp: string;
}

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

// ── Sentry hook (opsional) ────────────────────────────────────────────────────
// Aktifkan jika Sentry sudah dikonfigurasi di proyek ini.
// import * as Sentry from "@sentry/nextjs";
// function reportToSentry(entry: LogEntry) {
//   if (entry.level === "error") {
//     Sentry.captureMessage(entry.message, { extra: { context: entry.context } });
//   }
// }

function formatEntry(entry: LogEntry): string {
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
}

function writeLog(entry: LogEntry) {
  // Production: hanya warn dan error
  if (isProd && (entry.level === "debug" || entry.level === "info")) return;

  const formatted = formatEntry(entry);

  switch (entry.level) {
    case "debug":
      if (isDev) console.debug(formatted, entry.context ?? "");
      break;
    case "info":
      console.info(formatted, entry.context ?? "");
      break;
    case "warn":
      console.warn(formatted, entry.context ?? "");
      break;
    case "error":
      console.error(formatted, entry.context ?? "");
      // reportToSentry(entry); // ← aktifkan jika Sentry ready
      break;
  }
}

function createEntry(level: LogLevel, message: string, context?: unknown): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export const logger = {
  debug(message: string, context?: unknown) {
    writeLog(createEntry("debug", message, context));
  },

  info(message: string, context?: unknown) {
    writeLog(createEntry("info", message, context));
  },

  warn(message: string, context?: unknown) {
    writeLog(createEntry("warn", message, context));
  },

  error(message: string, context?: unknown) {
    writeLog(createEntry("error", message, context));
  },
} as const;
