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
    title: 'Smart Manufacturing',
    description:
      'Transform your factory operations with seamless IoT integration and real-time monitoring. Our ROS2-powered platform bridges legacy systems and modern automation to optimize production.',
  },
  {
    title: 'Optimized Production Lines',
    description:
      'Enhance operational efficiency with data-driven insights that streamline manufacturing processes. Identify bottlenecks and drive continuous improvement.',
  },
  {
    title: 'Predictive Maintenance',
    description:
      'Reduce downtime and maintenance costs through AI-powered predictive analytics. Proactively address issues to maintain peak performance on the production floor.',
  },
  {
    title: 'Automated Workflow Management',
    description:
      'Leverage automation to manage complex production workflows. Minimize human error and maximize productivity with intelligent task scheduling and resource allocation.',
  },
  {
    title: 'Scalable and Secure Solutions',
    description:
      'Our enterprise-grade platform supports scalable operations with robust security protocols. Adapt to evolving manufacturing needs while protecting critical data.',
  },
];

export default function SmartFactory() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Smart Factory Integration" />
      <PageHeadingSection title="Elevate your manufacturing processes with IoT-driven insights and automation. Experience the power of ROS2 to streamline production, reduce downtime, and enhance efficiency." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If you're ready to transform your factory into a smart, connected operation, get in touch with us!"
      />
    </>
  );
}

SmartFactory.seoTags = <PageSEOTags title="WiseVision | Smart Factory Integration" />;
