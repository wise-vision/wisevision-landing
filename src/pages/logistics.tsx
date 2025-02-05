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
    title: 'Real-Time Asset Tracking',
    description:
      'Monitor the movement of goods and assets in real time with our IoT-powered logistics solution. Benefit from complete visibility and optimized resource management throughout your supply chain.',
  },
  {
    title: 'Optimized Route Management',
    description:
      'Utilize real-time data and AI analytics to plan the most efficient routes. Reduce delivery times, cut costs, and improve overall customer satisfaction.',
  },
  {
    title: 'Predictive Analytics for Logistics',
    description:
      'Leverage AI to anticipate logistical challenges before they occur. Minimize delays and operational disruptions by addressing issues proactively.',
  },
  {
    title: 'Enhanced Supply Chain Visibility',
    description:
      'Gain comprehensive insights into every stage of your supply chain—from warehouse management to last-mile delivery. Our ROS2 integration ensures seamless communication across all nodes.',
  },
  {
    title: 'Scalable and Secure Deployments',
    description:
      'Our platform is designed for large-scale logistics operations. With robust security and scalable architecture, your logistics network can grow confidently with your business.',
  },
];

export default function Logistics() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Logistics Integration" />
      <PageHeadingSection title="Revolutionize your logistics operations with real-time monitoring, AI-driven insights, and seamless IoT integration. Powered by ROS2, our platform optimizes every step of your supply chain." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If you're looking to streamline your logistics and boost efficiency, contact us today!"
      />
    </>
  );
}

Logistics.seoTags = <PageSEOTags title="WiseVision | Logistics Integration" />;
