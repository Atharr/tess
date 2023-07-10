import net from 'net';
import jest from 'jest-mock';

import TCPServer from '../../../src/servers/TCPServer.js';
import { loadMessages } from '../../../src/messages/index.js';

// Mock console.error to spy on error messages
console.error = jest.fn();

describe('TCPServer', () => {
  let server;
  let client;

  const PORT = 12345;
  const MESSAGE = 'Hello, server!';
  const SENDER_ADDRESS = '127.0.0.1';
  const SENDER_PORT = 54321;
  const ERROR_MESSAGE = 'TCP server error';

  beforeAll(async () => {
    // Load the messages
    loadMessages('en-US', 'src/messages/messages');

    // Create a TCP server instance
    server = new TCPServer(PORT);
    await server.start();

    // Create a TCP client socket to connect to the server
    client = net.createConnection({ port: PORT });
  });

  afterAll(async () => {
    // Clean up after the test
    await new Promise((resolve) => {
      client.end(resolve);
    });
    await new Promise((resolve) => {
      server.server.close(resolve);
    });
  });

  test('TCP server should echo back the received message', async () => {
    await new Promise((resolve) => {
      // Listen for the server's response
      client.on('data', (data) => {
        expect(data.toString()).toBe(MESSAGE);
        resolve();
      });

      // Send a message to the server
      client.write(MESSAGE);
    });
  });

  /* test('TCP server should handle error events', async () => {
    await new Promise((resolve) => {
      // Emit an error event to simulate a server error
      server.server.emit('error', new Error(ERROR_MESSAGE));

      // Verify that the error message is logged
      server.server.on('close', () => {
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining(ERROR_MESSAGE));
        resolve();
      });

      // Send a message to the server (optional, just to verify it's still functioning)
      //client.write(MESSAGE);
    });
  });*/
});
