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
    title: 'AI at the Core',
    description:
      'Empower your systems with advanced AI capabilities that transform raw data into actionable insights in real time. Our platform, built on ROS2, ensures rapid data processing and effective decision-making.',
  },
  {
    title: 'Predictive Maintenance',
    description:
      'Leverage AI-driven analytics to anticipate system failures before they occur. Prevent costly downtime and maintain peak operational performance with proactive maintenance strategies.',
  },
  {
    title: 'Enhanced Decision-Making',
    description:
      'Utilize real-time analytics and intuitive dashboards to make informed decisions. Our solution provides the insights needed to optimize operations and drive innovation.',
  },
  {
    title: 'Seamless IoT Integration',
    description:
      'Integrate a wide range of IoT devices effortlessly into your existing workflows. The robust ROS2 framework ensures compatibility and smooth communication across your systems.',
  },
  {
    title: 'Scalable Intelligence',
    description:
      'Our AI-centric platform is designed to grow with your business. Adapt to evolving demands and scale your operations securely and efficiently.',
  },
];

export default function AICentricSystems() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="AI-Centric Systems Integration" />
      <PageHeadingSection title="Empower your operations with AI-driven insights and seamless IoT integration. Built on ROS2, our platform delivers real-time analytics and scalable intelligence for modern systems." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If AI-powered systems can drive your business forward, reach out to us today!"
      />
    </>
  );
}

AICentricSystems.seoTags = <PageSEOTags title="WiseVision | AI-Centric Systems Integration" />;
