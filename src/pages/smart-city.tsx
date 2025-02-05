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
    title: 'Connected Urban Infrastructure',
    description:
      'Empower your smart city projects with seamless IoT connectivity. Our platform integrates diverse urban systems into a unified, ROS2-based ecosystem for real-time monitoring and control.',
  },
  {
    title: 'Real-Time Monitoring and Control',
    description:
      'Monitor public services, energy grids, and traffic systems in real time. Make data-driven decisions that enhance efficiency and improve the quality of life in urban environments.',
  },
  {
    title: 'Scalable and Secure Deployments',
    description:
      'Our enterprise-grade solution is designed for scalable, multi-tenant deployments, ensuring your smart city infrastructure grows securely and reliably.',
  },
  {
    title: 'Data-Driven Urban Planning',
    description:
      'Transform raw data into actionable insights for urban development. Optimize resource allocation, enhance public safety, and create responsive city services.',
  },
  {
    title: 'Enhanced Citizen Engagement',
    description:
      'Utilize smart data to build interactive and responsive urban environments, increasing citizen satisfaction and participation in community initiatives.',
  },
];

export default function SmartCity() {
  return (
    <>
      <PageBanner image="analityka_dla_handlu" title="Smart City Integration" />
      <PageHeadingSection title="Transform urban landscapes with seamless IoT integration and ROS2-powered intelligence. Experience smarter cities through real-time monitoring, data-driven planning, and secure scalability." />
      <PageInfographicSectionWrapper sx={{ pt: 0 }}>
        <PageInfographic image="analityka_dla_handlu" />
        <PageDescriptionItems items={DESCRIPTION_ITEMS_1} />
      </PageInfographicSectionWrapper>
      <PageHeadingSection
        small
        title="If you believe that smart city solutions can redefine urban living, get in touch with us!"
      />
    </>
  );
}

SmartCity.seoTags = <PageSEOTags title="WiseVision | Smart City Integration" />;
