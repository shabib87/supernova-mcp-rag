/**
 * redirectConsole.ts
 *
 * Ensures all console output (except errors) is sent to stderr.
 *
 * Why?
 * - MCP (Model Context Protocol) servers using stdio transport must only print protocol-compliant JSON to stdout.
 * - Any extra output (console.log, console.info, console.warn, etc.) on stdout will break MCP clients (such as Cursor, VS Code, or MCP Inspector),
 *   resulting in protocol errors and failed tool calls.
 * - By redirecting all console output except console.error to stderr, you can safely debug or log information
 *   without interfering with MCP protocol communication.
 * - This is especially important in RAG (Retrieval-Augmented Generation) servers, where initialization and chunking
 *   may produce many logs or warnings.
 *
 * Usage:
 *   Import this file at the very top of your main entrypoint (e.g., index.ts):
 *     import './helpers/redirectConsole.js';
 *
 *   Now, you can use console.log, console.info, console.warn, and console.debug for debugging.
 *   All output will go to stderr, leaving stdout clean for MCP protocol messages.
 */

// Redirect all console output to stderr (except console.error, which is already stderr)
console.log = (...args) => console.error('[LOG]', ...args);
console.info = (...args) => console.error('[INFO]', ...args);
console.warn = (...args) => console.error('[WARN]', ...args);
console.debug = (...args) => console.error('[DEBUG]', ...args);
// Note: console.error is already sent to stderr by default.
