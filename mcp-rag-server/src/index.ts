import './helpers/redirectConsole.js';
import { mcp } from './mcp.js';

const run = async () => {
  mcp()
    .main()
    .catch(err => {
      console.error('Failed to start MCP server:', err);
      process.exit(1);
    });
};

run();
