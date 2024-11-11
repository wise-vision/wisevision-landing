import { PageSEOTags } from 'components/HeadTags';
import {
  PageBanner,
  PageDescriptionItems,
  PageHeadingSection,
  PageInfographic,
  PageInfographicSectionWrapper,
} from 'components/PageWithInfographic';

const DESCRIPTION_ITEMS_1 = [
  {
    title: 'Seamless Integration of LoRaWAN with ROS2',
    description:
      'The WiseVision LoRa Bridge allows for smooth integration of LoRaWAN devices into ROS2 systems. By bridging the IoT world with robotics, this tool facilitates data flow and real-time communication between LoRaWAN devices and ROS2, simplifying deployment and reducing operational costs.',
  },
  {
    title: 'Optimized Data Parsing and Transformation',
    description:
      'In its free version, the WiseVision LoRa Bridge provides a powerful parser that converts LoRaWAN data into ROS2 topic strings. For more advanced needs, the premium version supports custom data types, enabling specific data formats tailored to various IoT applications.',
  },
];

const DESCRIPTION_ITEMS_2 = [
  {
    title: 'Customizable Data Handling for Unique IoT Needs',
    description:
      'The WiseVision LoRa Bridge enables flexible data handling to support unique IoT project requirements. Its integration framework allows users to configure how LoRaWAN device data is processed and presented in the ROS2 environment, enhancing adaptability across projects.',
  },
  {
    title: 'Open and Scalable for Future Expansion',
    description:
      'Built on open standards, the WiseVision LoRa Bridge is designed to grow with your needs. Whether adding more devices or scaling the platform, this tool supports future integrations and expansions, ensuring a long-lasting IoT solution.',
  },
];

export default function WiseVisionLoRaBridge() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="WiseVision Bridge" />
      <PageHeadingSection title="Empowering Seamless IoT-ROS2 Integration with WiseVision Bridge" />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="lora_bridge" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_2} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="Looking for a powerful integration tool for your IoT projects? Visit our documentation to learn more about the WiseVision LoRa Bridge."
      />
    </>
  );
}

WiseVisionLoRaBridge.seoTags = <PageSEOTags title="WiseVision | LoRa Bridge" />;
