import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import UDPServer from './servers/UDPServer.js';
import TCPServer from './servers/TCPServer.js';
import Msg, { loadMessages } from './messages/index.js';

try {
  // Read the YAML config file
  const config = load(readFileSync('config.yaml', 'utf8'));

  const language = config.language || 'en-US';
  const messagesPath = config.messagesPath || 'messages';
  loadMessages(language, messagesPath);

  const udpPorts = Array.isArray(config.udpPorts) ? config.udpPorts : [];
  const tcpPorts = Array.isArray(config.tcpPorts) ? config.tcpPorts : [];
  if (udpPorts.length === 0 && tcpPorts.length === 0) {
    throw new Error(Msg.ERROR_NO_PORT_SPECIFIED);
  }

  // TCP server setup
  const tcpServers = tcpPorts.map(async (port) => {
    const tcpServer = new TCPServer(port);
    try {
      return await tcpServer.start();
    } catch (err) {
      return console.error(Msg.ERROR_STARTING_TCP_SERVER, port, err);
    }
  });

  // UDP server setup
  const udpServers = udpPorts.map(async (port) => {
    const udpServer = new UDPServer(port);
    try {
      return await udpServer.start();
    } catch (err) {
      return console.error(Msg.ERROR_STARTING_UDP_SERVER, port, err);
    }
  });

  Promise.all([...tcpServers, ...udpServers])
    .then(() => console.log(Msg.SERVERS_STARTED_SUCCESSFULLY))
    .catch((err) => console.error(Msg.ERROR_STARTING_SERVERS, err));
} catch (error) {
  console.error(Msg.ERROR_READING_CONFIG_FILE, error.message);
}