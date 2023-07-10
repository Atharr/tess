import { createServer } from 'net';
import { format } from 'util';

import Msg from '../messages/index.js'

/*
 * A simple TCP server that echoes back whatever it receives.
 */
export default class TCPServer {
  /*
   * @param {number} port - The port to listen on.
   */
  constructor(port) {
    this.port = port;
    this.server = createServer((socket) => {
      console.log(Msg.TCP_CLIENT_CONNECTED, socket.remoteAddress, socket.remotePort);

      socket.on('data', (data) => {
        console.log(Msg.TCP_MESSAGE_RECEIVED, data.toString(), socket.remoteAddress, socket.remotePort);

        // Send the message back to the client
        socket.write(data);
      });

      socket.on('end', () => console.log(Msg.TCP_CLIENT_DISCONNECTED, socket.remoteAddress, socket.remotePort));
    });

    this.server.on('error', (err) => console.error(format(Msg.TCP_SERVER_ERROR, this.port, err)));
  }

  /*
   * Starts the TCP server.
   * @returns {Promise} A promise that resolves when the server is started.
   * @rejects {Error} An error that occurs while starting the server.
   * @example
   * const tcpServer = new TCPServer(1234);
   * tcpServer.start()
   *   .then(() => console.log('TCP server started successfully.'))
   *   .catch((err) => console.error('Error starting TCP server:', err));
   * @example
   * const tcpServer = new TCPServer(1234);
   * try {
   *   await tcpServer.start();
   *   console.log('TCP server started successfully.');
   * } catch (err) {
   *   console.error('Error starting TCP server:', err);
   * }
   */
  start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        console.log(Msg.TCP_SERVER_STARTED, this.port);
        resolve();
      });

      this.server.on('error', (err) => reject(err));
    });
  }
}
