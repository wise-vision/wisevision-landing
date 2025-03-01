# WiseVision Bridge

WiseVision Bridge is a hub for all kinds of data in ROS 2.

### Introduction

The WiseVision Data Bridge is a extendable tool for managing data in ROS 2. Convert any kind of data
to ROS 2 messages and publish them to the ROS 2 network.

For more information, see the
[WiseVision Bridge About](2.wisevision_bridge/2.About/1.wisevision_data_black_box.md) page.

### Idea

While we develop the parsers and hooks for specific data protocols, we share a free and open source
parser into `std_msgs/String` messages. This way, you can easily publish any kind of data to the ROS
2 network.

For the specific data types like some sensor data, we have paid parsers available. This omit the
need for you to write the parser yourself from string to the specific message type. You can get the
right ROS 2 message type right away.

### Supported

- [x] WiseVision LoRaWAN Bridge
      [WiseVision LoRaWAN Bridge](3.lorawan_bridge/2.About/1.wisevision_lorawan_bridge.md)

### Roadmap

TODO

---

Do you need support with this topic or have questions about your project? Feel free to contact us!
[support@wisevision.tech](mailto:support@wisevision.tech)
