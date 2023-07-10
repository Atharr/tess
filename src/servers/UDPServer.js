import { createSocket } from 'dgram';

import Msg from '../messages/index.js';

/* 
 * A simple UDP server that echoes back whatever it receives.
 */
export default class UDPServer {
  /*
   * @param {number} port - The port to listen on.
   */
  constructor(port) {
    this.port = port;
    this.socket = createSocket('udp4');

    this.socket.on('error', (err) => {
      console.error(Msg.UDP_SERVER_ERROR, this.port, err.toString());
      this.socket.close();
    });

    this.socket.on('message', (message, rinfo) => {
      console.log(Msg.UDP_MESSAGE_RECEIVED, message.toString(), rinfo.address, rinfo.port);

      // Send the message back to the sender
      this.socket.send(message, 0, message.length, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.log(`Error sending UDP message: ${err}`);
        } else {
          console.log(Msg.UDP_MESSAGE_SENT);
        }
      });
    });
  }

  /*
    * Starts the UDP server.
    * @returns {Promise} A promise that resolves when the server is started.
    * @rejects {Error} An error that occurs while starting the server.
    * @example
    * const udpServer = new UDPServer(1234);
    * udpServer.start()
    *   .then(() => console.log('UDP server started successfully.'))
    *   .catch((err) => console.error('Error starting UDP server:', err));
    * @example
    * const udpServer = new UDPServer(1234);
    * try {
    *   await udpServer.start();
    *   console.log('UDP server started successfully.');
    * } catch (err) {
    *   console.error('Error starting UDP server:', err);
    * }
    */
  start() {
    return new Promise((resolve, reject) => {
      this.socket.bind(this.port, () => {
        console.log(Msg.UDP_SERVER_STARTED, this.port);
        resolve();
      });

      this.socket.on('error', (err) => reject(err));
    });
  }
}
