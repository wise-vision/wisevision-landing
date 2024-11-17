# Parsing LDS02 door sensor payload


For detailed LDS02 door sensor documentation see [this](https://wiki.dragino.com/xwiki/bin/view/Main/User%20Manual%20for%20LoRaWAN%20End%20Nodes/LDS02%20-%20LoRaWAN%20Door%20Sensor%20User%20Manual/#H4.3UplinkPayload).


Full code:
```python
import rclpy
from rclpy.node import Node

from std_msgs.msg import String, UInt64


class LDS02(Node):
    def __init__(self) -> None:
        super().__init__("lds02_sample_parser")
        self.publisher = self.create_publisher(UInt64, "output", 10)
        self.subscription = self.create_subscription(
            String,
            "input",
            self.callback,
            10,
        )

    def callback(self, msg: String) -> None:
        numbers = []
        for i in range(0, len(msg.data), 2):
            numbers.append(int(msg.data[i : i + 2], 16))

        total_door_open = (numbers[3] << 16) + (numbers[4] << 8) + numbers[5]
        output_msg = UInt64()
        output_msg.data = total_door_open
        self.publisher.publish(output_msg)


def main() -> None:
    rclpy.init()
    lds02 = LDS02()
    rclpy.spin(lds02)
    lds02.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
```
