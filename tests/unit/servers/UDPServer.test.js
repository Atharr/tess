import dgram from 'dgram';
import jest from 'jest-mock';

import UDPServer from '../../../src/servers/UDPServer.js';
import { loadMessages } from '../../../src/messages/index.js';

// Mock console.error to spy on error messages
console.error = jest.fn();

describe('UDPServer tests', () => {
  let server;
  let client;

  const PORT = 12345;
  const MESSAGE = 'Hello, Tess!';
  const SENDER_ADDRESS = '127.0.0.1';
  const SENDER_PORT = 54321;
  const ERROR_MESSAGE = 'UDP server error';

  beforeAll(async () => {
    // Load the messages
    loadMessages('en-US', 'src/messages/messages');

    // Create a UDP server instance
    server = new UDPServer(PORT);
    await server.start();

    // Create a UDP client socket to send a message to the server
    client = dgram.createSocket('udp4');
  });

  afterAll(async () => {
    // Clean up after the test
    await new Promise((resolve) => {
      client.close(resolve);
    });
    await new Promise((resolve) => {
      server.socket.close(resolve);
    });
  });

  test('UDP server should echo back the received message', async () => {
    await new Promise((resolve) => {
      // Listen for the server's response
      client.on('message', (message, rinfo) => {
        expect(message.toString()).toBe(MESSAGE);
        expect(rinfo.address).toBe(SENDER_ADDRESS);
        expect(rinfo.port).toBe(PORT);
        resolve();
      });

      // Send a message to the server
      client.send(MESSAGE, PORT, SENDER_ADDRESS, (err) => {
        if (err) {
          throw err;
        }
      });
    });
  });

  /* test('UDP server should handle error events', async () => {
    await new Promise((resolve) => {
      // Emit an error event to simulate a socket error
      server.socket.emit('error', new Error(ERROR_MESSAGE));

      // Verify that the error message is logged
      server.socket.on('close', () => {
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining(ERROR_MESSAGE));
        resolve();
      });

      // Send a message to the server (optional, just to verify it's still functioning)
      client.send(MESSAGE, PORT, SENDER_ADDRESS);
    });
  }); */
});
