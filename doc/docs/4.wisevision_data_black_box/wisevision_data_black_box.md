---
sidebar_position: 1
---

# WiseVision Data Black Box – What It Is and How It Works

![WiseVisiona Data Black Box](asset/wisevision_data_black_box.jpeg)

### Introduction
#

**WiseVision Data Black Box** is a tool that connects **InfluxDB**, a time-series database, with **ROS 2**, acting as a **bridge** between these two. This integration allows ROS 2 to retrieve historical and real-time data from InfluxDB, providing robots and other smart systems with valuable insights.

### What Does It Do?
#

Imagine a scenario where your robot collects various data, such as temperature, humidity, or location, and saves it in a database for analysis or reference. However, to use this data, the robot needs a way to retrieve it from the database easily.

That’s where **WiseVision Data Black Box** comes in. This project:
1. **Identifies the type of data stored in InfluxDB** – It allows users to see what data has been recorded by robots or other devices.
2. **Retrieves data within a specified time range** – Users can query data from specific time periods, whether for a particular day, hour, or minute.
3. **Acts as a bridge between InfluxDB and ROS 2 using Zenoh server** – ROS 2 can request data from InfluxDB through the Zenoh server, which facilitates smooth and fast communication between the database and ROS 2.

### How Does WiseVision Data Black Box Work?
#

The main function of **WiseVision Data Black Box** is to serve as a “translator”:
1. **ROS 2** sends a data request through the **Zenoh server**, for example: “What was the temperature 10 minutes ago?”
2. **WiseVision Data Black Box** receives this request via Zenoh, then forwards it to **InfluxDB** – where all the recorded information is stored.
3. **InfluxDB** responds with the requested data, and **WiseVision Data Black Box** then sends it back through the Zenoh server to **ROS 2**.

By using Zenoh, which is optimized for real-time data distribution, WiseVision Data Black Box can ensure a fast, reliable connection between InfluxDB and ROS 2, making data access efficient and quick.

### Key Features
#
Using WiseVision Data Black Box, you can:
- **Identify Stored Data Types** – Check what information (e.g., temperature, battery levels) has been recorded in InfluxDB.
- **Fetch Historical Data** – Retrieve data from any specified timeframe, useful for tracking past conditions or patterns.
- **Use Zenoh Server for Communication** – Leverage the Zenoh server to handle all communication, making data queries fast and seamless for ROS 2 systems.

### Benefits
- **Efficient Data Management** – Simplifies access to historical and real-time data without needing direct database access.
- **Seamless Integration** – Provides a straightforward way to connect ROS 2 with InfluxDB via Zenoh, without complex configurations.
- **Flexible Queries** – Allows users to specify the data range they need based on the application’s requirements.

---

#
_Written by: Cezary Krzeminski, wisevision_ 

Do you need support with this topic or have questions about your project? Feel free to contact us! [support@wisevision.tech](mailto:support@wisevision.tech)
