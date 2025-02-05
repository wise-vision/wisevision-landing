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
    title: 'Built on ROS 2 - The Heart of Innovation',
    description:
      'WiseVision is powered by ROS2, a cutting-edge framework that ensures robust, real-time communication between devices. This open-source architecture not only enhances modularity and flexibility but also provides a scalable foundation for integrating IoT and robotics seamlessly.',
  },
  {
    title: 'Streamlined Robotic Fleet Management',
    description:
      'Monitor and control your robotic fleet in real time. Our platform provides precise insights into each robots performance, allowing you to optimize resource allocation and workflow efficiency.',
  },
  {
    title: 'Predictive Maintenance with AI',
    description:
      'Utilize advanced AI-driven analytics to anticipate maintenance needs before issues occur. This proactive approach reduces downtime and ensures your robots operate at peak performance.',
  },
  {
    title: 'Seamless IoT Integration',
    description:
      'Enhance your robotics applications by integrating IoT and LoRaWAN devices. Our system bridges sensor data with the ROS2 ecosystem, creating a unified network for smarter operations.',
  },
  {
    title: 'Automated Operational Efficiency',
    description:
      'Implement intelligent automation to streamline complex tasks. Reduce manual intervention, accelerate production cycles, and focus your teams efforts on strategic innovations.',
  },
  {
    title: 'Scalable and Secure Deployments',
    description:
      'Built for enterprise-grade applications, our platform supports scalable, multi-tenant architectures with robust security protocols. Expand your robotics network confidently while keeping your data safe.',
  },
  {
    title: 'Data-Driven Decision Making',
    description:
      'Transform raw data into actionable insights. Real-time analytics and detailed reporting empower you to make informed decisions that continuously improve operational performance.',
  },
  {
    title: 'Enhanced Operational Visibility',
    description:
      'Gain a comprehensive view of your robotics ecosystem with continuous monitoring. Instantly detect and respond to issues, ensuring optimal performance and reliability across all connected devices.',
  },
];

export default function Robotics() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Robotics Integration" />
      <PageHeadingSection title="Transform your robotics operations with seamless IoT integration and the power of ROS 2. Experience enhanced control, efficiency, and predictive maintenance in real time." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If you believe that intelligent robotics integration, powered by ROS2, could elevate your operations, get in touch with us!"
      />
    </>
  );
}

Robotics.seoTags = <PageSEOTags title="WiseVision | Robotics Integration" />;
