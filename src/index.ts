#!/usr/bin/env node
/* PROJECT LICENSE */

import { Server } from './Server';

import config from '../config/server.json';

/**
 * Main function of the package.
 */
export async function main(args: string[]): Promise<void> {
  args.shift(); // Interpreter
  args.shift(); // Script path

  if (!config) {
    throw new Error('A configuration is required');
  }

  const server = new Server(config);
  await server.listen();
}

// Catches uncaught exceptions and avoids process termination
process.on('uncaughtException', function (err) {
  if (err instanceof Error) {
    process.stderr.write('Process catch - uncaughtException: ' +
      err.name + ' ' +
      err.message + ' ' +
      err.stack);
  } else {
    process.stderr.write('Process catch - uncaughtException: ' +
      JSON.stringify(err));
  }
});
// Catches unhandled rejections and avoids process termination
process.on('unhandledRejection', function (err) {
  if (err instanceof Error) {
    process.stderr.write('Process catch - unhandledRejection: ' +
      err.name + ' ' +
      err.message + ' ' +
      err.stack);
  } else {
    process.stderr.write('Process catch - unhandledRejection: ' +
      JSON.stringify(err));
  }
});

main(process.argv); // Main execution
