# TESS - TCP/UDP Echo Server Solution

Occasionally, there arises a need to diagnose network connectivity issues on a device or identify accessible ports. During such instances, a valuable asset is a straightforward server capable of actively monitoring TCP and/or UDP ports and returning (echoing) the received data. This is precisely the purpose of `TESS`: to be a TCP/UDP Echo Server Solution.

`TESS` is a Node.js application that implements simple TCP and UDP echo servers. The TCP server accepts incoming TCP connections, reads the data sent by the client, and echoes it back. The UDP server listens for incoming UDP packets and echoes them back to the sender.

## Features

- Configurable ports for TCP and UDP servers.
- Multilingual support for error messages.
- YAML configuration file for specifying server ports and language.
- YAML message files for customizable error messages.

## Prerequisites

- Node.js (version 12 or above)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

    ```shell
    git clone https://github.com/Atharr/tess.git
    ```
2. Change to the project directory:

    ```shell
    cd tess
    ```

3. Install the dependencies:
    ```shell
    npm install
    ```
## Configuration

The server can be configured using the `config.yaml` file located in the project root directory. You can modify the following properties:

* `language` (optional): The language code for error messages. Default value is `en-US`.
* `messagesPath` (optional): The path to the directory containing the message YAML files. Default value  is `messages`.
* `tcpPorts` (array): An array of TCP port numbers to listen on.
* `tcpPorts`  (array): An array of UDP port numbers to listen on.

Please note that, while both `tcpPorts` and `udpPorts` are optional, at least one or the other must be present and contain one or more ports. The program won't run if no ports are specified.

## Usage

Start the server by running the following command:
```shell
npm start
```
The server will start listening on the specified UDP and TCP ports. Any incoming UDP packets or TCP connections will be logged to the console, and the corresponding data will be echoed back.

Pressing `Ctrl-C` will stop the server.

In order to send messages to the application, you can use various networking tools or programming libraries that allow you to establish UDP or TCP connections. Here are a few options:

1. **Netcat (nc)**: You can use the `netcat` command-line tool to send messages to the application. For example, to send a UDP message to the server listening on TCP port 1234, you can run:
    ```bash
    echo "Hello, Tess!" | nc <server-address> 1234
    ```
    To send a UDP message, you can use:
    ```bash
    echo "Hello, Tess!" | nc -u <server-address> 1234
    ```
    When sending messages from the same device where `TESS` is running, please use `localhost` or `127.0.0.1` as the server address.

2. **Socket programming**: You can write a custom program using a suitable programming language (e.g., JavaScript, Python, Java) and leverage the respective socket libraries to establish UDP or TCP connections and send messages to the server.

    Here's an example using JavaScript with Node.js for sending a UDP message to the server:
    ```js
    const dgram = require('dgram');

    const client = dgram.createSocket('udp4');
    const serverAddress = '<server-address>';
    const serverPort = 1234;
    const message = 'Hello, Tess!';

    client.send(message, 0, message.length, serverPort, serverAddress, (err) => {
      if (err) {
        console.error('Error sending UDP message: ', err);
      } else {
        console.log('UDP message sent successfully!');
      }
      client.close();
    });
    ```
    For TCP, you can use the `net` module in Node.js or similar libraries in other programming languages to establish a TCP connection and send messages.

These are just a couple of examples, but there are numerous tools and libraries available for sending TCP or UDP messages to an application. You can choose the one that best fits your requirements and programming environment.

## Contributing
Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](https://github.com/Atharr/tess/blob/main/LICENSE).