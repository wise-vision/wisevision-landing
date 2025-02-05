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
    title: 'Precision Farming',
    description:
      'Leverage IoT data to optimize resource usage— from irrigation to fertilization— ensuring maximum yield and minimal waste. Our ROS2-based platform brings cutting-edge precision to modern agriculture.',
  },
  {
    title: 'Real-Time Crop Monitoring',
    description:
      'Monitor crop health and environmental conditions in real time. Timely insights allow you to implement corrective measures immediately, safeguarding your harvest.',
  },
  {
    title: 'Predictive Analytics for Agriculture',
    description:
      'Utilize AI-driven analytics to forecast issues such as pest infestations or nutrient deficiencies. Stay ahead of challenges and protect your investments with proactive insights.',
  },
  {
    title: 'Automated Agricultural Operations',
    description:
      'Integrate robotics and IoT for automated planting, harvesting, and maintenance. Streamline agricultural processes and improve overall operational efficiency.',
  },
  {
    title: 'Scalable and Secure Farming Solutions',
    description:
      'Our enterprise-grade solution is built for scalability and security, ensuring that your agricultural operations can expand and adapt to future demands seamlessly.',
  },
];

export default function Agriculture() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Agriculture Integration" />
      <PageHeadingSection title="Revolutionize farming with IoT-driven insights and automation. Harness the power of ROS2 to achieve precision, efficiency, and scalability in modern agriculture." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If you’re ready to modernize your agricultural operations, contact us today!"
      />
    </>
  );
}

Agriculture.seoTags = <PageSEOTags title="WiseVision | Agriculture Integration" />;
