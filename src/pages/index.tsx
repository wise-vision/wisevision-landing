import { AppLink } from 'components/AppLink';
import { MENU_ID } from 'components/Menu';
import { ROUTES } from 'routes';
import { pxToRem } from 'theme';
import { Box, Button, Container, Flex, Grid, Heading, Image, ThemeUIStyleObject } from 'theme-ui';
import { WithChildren } from 'types';
import { Link } from 'react-scroll';

const SCROLL_TARGET = 'scrollTarget';

function HeroSection() {
  const navHeight = () => {
    if (process.browser && document) {
      const menu = document.getElementById(MENU_ID);

      if (menu) {
        const navHeight = menu.clientHeight;
        return navHeight;
      }
    }

    return 0;
  };

  return (
    <Flex
      sx={{
        py: 6,
        minHeight: [`calc(100vh - ${pxToRem(59)})`, `calc(100vh - ${pxToRem(70)})`],
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        as="video"
        // @ts-ignore
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        id="myVideo"
        poster="static/home/hero.jpg"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="static/home/hero_video.mp4" type="video/mp4" />
      </Box>
      <Container sx={{ position: 'relative', zIndex: 1 }}>
      <Heading variant="largeHeading" sx={{ maxWidth: '7em', mx: 'auto', textAlign: 'center' }}>
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
        }}
      >
        <Link to={SCROLL_TARGET} offset={navHeight() * -1} smooth duration={800}>
          <Image src="/static/home/arrow_down.png" sx={{ cursor: 'pointer' }} />
        </Link>
      </Box>
    </Flex>
  );
}

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

function SystemSection() {
  return (
    <SectionWrapper
      id={SCROLL_TARGET}
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
        description="Combining ROS2's advanced robotics software with LoRaWAN's long-range network, this technology brings smarter, more efficient connectivity to everyday life. Ideal for smart homes, agriculture, and city management, it offers reliable communication over large areas, using less power. It's a game-changer for making advanced technology accessible and practical for everyone."
      />
    </SectionWrapper>
  );
}

function DetectionSection() {
  return (
    <SectionWrapper
      sectionImage="recognize"
      styles={{
        image: {
          objectPosition: ['left', 'center'],
        },
      }}
    >
      <Box />
      <SectionContent
        title="Smart Detection and Analysis"
        description="Swiftly pinpoints outliers, analyzing data anomalies. Identifies unusual patterns, aiding in error detection and insights. Streamlines complex data analysis, enhancing accuracy and efficiency."
      />
    </SectionWrapper>
  );
}

function StudySection() {
  return (
    <SectionWrapper
      sectionImage="study"
      styles={{
        image: {
          objectPosition: ['right', 'center'],
        },
      }}
    >
      <SectionContent
        title="Precision in Numbers"
        description="Accurately measures key statistics, providing comprehensive data insights. Tracks and analyzes trends, enabling informed decision-making. Delivers precise statistical analysis for effective data evaluation."
      />
      <Box />
    </SectionWrapper>
  );
}

function DigitalTwinSection() {
  return (
    <SectionWrapper
      sectionImage="localize"
      styles={{
        image: {
          objectPosition: ['right', 'center'],
        },
      }}
    >
      <SectionContent
        title="Digital Twin Simulation with O3DE"
        description="Leveraging the power of O3DE (Open 3D Engine), this feature offers a sophisticated digital twin simulation of IoT environments. It provides a realistic, interactive 3D representation of IoT devices and systems, allowing users to test, analyze, and optimize scenarios in a virtual space. It's an essential tool for advanced IoT development and troubleshooting."
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

function ControlPanelSection() {
  return (
    <SectionWrapper
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
        title="Interactive Control Panel"
        description="User-friendly interface serves as the central hub for all data interactions. Users can effortlessly set and adjust data pipelines, view comprehensive data sets, and create custom visualizations. The panel provides intuitive tools for deep data exploration, AI analysis and monitoring real-time data flows."
        styles={{
          title: {
            maxWidth: '100%',
          },
        }}
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
          objectPosition: ['left', 'center'],
          '@media screen and (max-width: 480px)': {
            objectPosition: '-30px',
          },
        },
      }}
    >
      <Box />
      <SectionContent
        title="Notifications and Automatic Execution"
        description="Sends real-time alerts, notifying users of any unusual activity. Provides instant notifications, allowing swift action to be taken. Integrated with ROS 2 to enable automatic execution of tasks."
      />
    </SectionWrapper>
  );
}

const USAGE_ITEMS = [
  {
    icon: 'identyfikacja',
    label: 'Identyfikacja obiektów i osób',
    href: ROUTES.IDENTYFIKACJA,
  },
  {
    icon: 'analityka_handlu',
    label: 'Analityka dla handlu',
    href: ROUTES.ANALITYKA_DLA_HANDLU,
  },
  {
    icon: 'wideo_na_zywo',
    label: 'Wideo na żywo',
    href: ROUTES.WIDEO_NA_ZYWO,
  },
  {
    icon: 'zarzadzanie_wideo',
    label: 'Zarządzanie zasobami wideo',
    href: ROUTES.ZARZADZANIE_WIDEO,
  },
  {
    icon: 'zdalny_dostep',
    label: 'Zdalny dostęp',
    href: ROUTES.ZDALNY_DOSTEP,
  },
  {
    icon: 'covid',
    label: '#STOP COVID19',
    href: ROUTES.COVID,
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
            Main Use Cases
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
                  <Button variant="outline">Sprawdź</Button>
                </AppLink>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default function Home() {
  return (
    <Box>
      <HeroSection />
      <SystemSection />
      <DetectionSection />
      <StudySection />
      <ControlPanelSection />
      <DigitalTwinSection />
      <NotificationSection />
      <UsageSection />
    </Box>
  );
}
