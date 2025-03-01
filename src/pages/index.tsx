import React from 'react';
import { AppLink } from 'components/AppLink';
import { MENU_ID } from 'components/Menu';
import { ROUTES } from 'routes';
import { pxToRem } from 'theme';
import { Box, Button, Container, Flex, Grid, Heading, Image, ThemeUIStyleObject } from 'theme-ui';
import { WithChildren } from 'types';
import { Link } from 'react-scroll';
import InteractiveNetworkVisualization from 'components/InteractiveNetworkVisualization';

// Global Constants
const SCROLL_TARGET = 'scrollTarget';

// Helper Components
function SectionWrapper({
  id,
  sectionImage,
  children,
  styles,
}: {
  id?: string;
  sectionImage: string;
  styles?: {
    image: ThemeUIStyleObject;
  };
} & WithChildren) {
  return (
    <Flex
      id={id}
      sx={{
        py: [0, 5],
        minHeight: ['auto', pxToRem(450)],
        alignItems: 'center',
        position: 'relative',
        flexDirection: ['column', 'row'],
      }}
    >
      <Image
        src={`static/home/section_${sectionImage}.jpg`}
        sx={{
          position: ['relative', 'absolute'],
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
          minHeight: pxToRem(170),
          objectFit: 'cover',
          ...styles?.image,
        }}
      />
      <Container sx={{ pb: [pxToRem(48), 0], pt: [3, 0] }}>
        <Grid columns={[1, 2]} gap={[0, pxToRem(80)]}>
          {children}
        </Grid>
      </Container>
    </Flex>
  );
}

function SectionContent({
  title,
  description,
  styles,
}: {
  title: string;
  description: string;
  styles?: {
    title?: ThemeUIStyleObject;
  };
}) {
  return (
    <Box>
      <Heading sx={{ maxWidth: '7em', mb: 3, ...styles?.title }}>{title}</Heading>
      <Box sx={{ maxWidth: '31em' }}>{description}</Box>
    </Box>
  );
}

// Section Components
function HeroSection() {
  const navHeight = () => {
    if (process.browser && document) {
      const menu = document.getElementById(MENU_ID);
      if (menu) {
        return menu.clientHeight;
      }
    }
    return 0;
  };

  return (
    <Flex
      sx={{
        py: 0, // Remove padding to allow full screen
        minHeight: [`calc(100vh - ${pxToRem(59)})`, `calc(100vh - ${pxToRem(70)})`],
        height: '100vh', // Ensure it takes full viewport height
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden', // Prevent any overflow issues
      }}
    >
      {/* InteractiveNetworkVisualization with explicit z-index */}
      <InteractiveNetworkVisualization 
        sx={{
          zIndex: 0, // Ensure this is behind everything
          opacity: 0.9, // Reduced opacity for better text visibility
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 2 }}> {/* Increased z-index from 1 to 2 */}
        <Heading 
          variant="largeHeading" 
          sx={{ 
            maxWidth: '7em', 
            mx: 'auto', 
            textAlign: 'center',
            textShadow: '0 0 15px rgba(0,0,0,0.7)', // Increased shadow for better readability
          }}
        >
          Wisely connected IoT
        </Heading>
      </Container>
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          left: '0',
          right: '0',
          textAlign: 'center',
          zIndex: 2, // Match container z-index
        }}
      >
        <Link to={SCROLL_TARGET} offset={navHeight() * -1} smooth duration={800}>
          <Image 
            src="/static/home/arrow_down.png" 
            sx={{ 
              cursor: 'pointer',
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' // Add shadow to arrow
            }} 
          />
        </Link>
      </Box>
    </Flex>
  );
}

function ControlPanelSection() {
  return (
    <SectionWrapper
      id={SCROLL_TARGET}
      sectionImage="watch"
      styles={{
        image: {
          objectPosition: ['left', 'center'],
          '@media screen and (max-width: 480px)': {
            objectPosition: '-35px',
          },
        },
      }}
    >
      <Box />
      <SectionContent
        title="WiseVision Dashboard"
        description="Our straightforward web interface offers basic tools for easy data monitoring and control. With the WiseVision Dashboard, you can quickly view your data and adjust essential settings without any complexity. It's designed for users who need a simple, effective way to manage their data."
        styles={{
          title: {
            maxWidth: '100%',
          },
        }}
      />
    </SectionWrapper>
  );
}

function BlackBoxSection() {
  return (
    <SectionWrapper
      sectionImage="blackbox"
      styles={{
        image: {
          objectPosition: ['right', 'center'],
        },
      }}
    >
      <SectionContent
        title="Data Black Box"
        description="Simple and efficient way to store and access your data. Allows you to view and use your information in real-time while securely saving it for future. Unlike other systems that might interrupt your work, our solution lets you continue your operations smoothly, ensuring your data is always safe and ready for analysis whenever you need it."
        styles={{
          title: {
            maxWidth: '10em',
          },
        }}
      />
      <Box />
    </SectionWrapper>
  );
}

function AnalysisSection() {
  return (
    <SectionWrapper
      sectionImage="data"
      styles={{
        image: {
          objectPosition: ['left', 'center'],
        },
      }}
    >
      <Box />
      <SectionContent
        title="Advanced Data Analysis with AI"
        description="Harness AI algorithms for comprehensive data analysis. Detect anomalies, uncover patterns, and gain deep insights using free, readily available ROS2 packages."
      />
    </SectionWrapper>
  );
}

function UControllerSection() {
  return (
    <SectionWrapper
      sectionImage="ucontroller"
      styles={{
        image: {
          objectPosition: ['right', 'center'],
        },
      }}
    >
      <SectionContent
        title="Micro Power"
        description="Enhance your system with custom Microcontroller. Unleash the full potential with flexible solutions that can be tailored to your specific needs."
      />
      <Box />
    </SectionWrapper>
  );
}

function SystemSection() {
  return (
    <SectionWrapper
      sectionImage="system"
      styles={{
        image: {
          objectPosition: ['left', 'center'],
        },
      }}
    >
      <Box />
      <SectionContent
        title="ROS 2 and LoRaWAN"
        description="Combining ROS2 with LoRaWAN's devices enables smarter, efficient connectivity with your data. Ideal for smart factories, agriculture, and city management—offering reliable communication over large areas."
      />
    </SectionWrapper>
  );
}

function NotificationSection() {
  return (
    <SectionWrapper
      sectionImage="alarm"
      styles={{
        image: {
          objectPosition: ['right', 'center'],
        },
      }}
    >
      <SectionContent
        title="Notifications and Automatic Execution"
        description="Sends real-time alerts, notifying users of any unusual activity. Provides instant notifications, allowing swift action to be taken. Integrated with ROS 2 to enable automatic execution of tasks."
        styles={{
          title: {
            maxWidth: '100%',
          },
        }}
      />
      <Box />
    </SectionWrapper>
  );
}

// Constants for Usage Section
const USAGE_ITEMS = [
  {
    icon: 'analityka_handlu',
    label: 'AI Centric Systems',
    href: ROUTES.AI_CENTRIC_SYSTEMS,
  },
  {
    icon: 'zarzadzanie_wideo',
    label: 'Smart Factory',
    href: ROUTES.SMART_FACTORY,
  },
  {
    icon: 'wideo_na_zywo',
    label: 'Logistics',
    href: ROUTES.LOGISTICS,
  },
  {
    icon: 'identyfikacja',
    label: 'Agriculture',
    href: ROUTES.AGRICULTURE,
  },
  {
    icon: 'zdalny_dostep',
    label: 'Robotics',
    href: ROUTES.ROBOTICS,
  },
  {
    icon: 'covid',
    label: 'Smart City',
    href: ROUTES.SMART_CITY,
  },
];

function UsageSection() {
  return (
    <>
      <Box sx={{ bg: 'primary', py: [4, pxToRem(90)] }}>
        <Container>
          <Heading
            sx={{ color: 'textAlt', textAlign: 'center', maxWidth: ['8em', '100%'], mx: 'auto' }}
          >
            WiseVision Suite of Tools
          </Heading>
        </Container>
      </Box>
      <Box sx={{ bg: 'backgroundMuted', py: pxToRem(100) }}>
        <Container>
          <Grid columns={[1, 2, 3]} gap={pxToRem(75)}>
            {USAGE_ITEMS.map(({ icon, label, href }) => (
              <Box key={icon} sx={{ textAlign: 'center' }}>
                <Box>
                  <Image src={`/static/icons/${icon}.png`} />
                </Box>
                <Heading
                  sx={{
                    mt: 3,
                    mb: pxToRem(20),
                    maxWidth: '7em',
                    mx: 'auto',
                    height: '2.25em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {label}
                </Heading>
                <AppLink href={href}>
                  <Button variant="outline">Check</Button>
                </AppLink>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

// Export Home page component
export default function Home() {
  return (
    <Box>
      <HeroSection />
      <ControlPanelSection />
      <BlackBoxSection />
      <AnalysisSection />
      <UControllerSection />
      <SystemSection />
      <NotificationSection />
      <UsageSection />
    </Box>
  );
}
