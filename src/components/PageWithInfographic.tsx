import { ReactNode } from 'react';
import { pxToRem } from 'theme';
import { Box, Container, Flex, Grid, Heading, Image, SxProp, ThemeUIStyleObject } from 'theme-ui';
import { WithChildren } from 'types';

export function PageBanner({
  image,
  title,
  styles,
}: {
  image: string;
  title: string;
  styles?: { background?: ThemeUIStyleObject };
}) {
  return (
    <Flex
      sx={{
        py: 5,
        minHeight: [pxToRem(375), pxToRem(450)],
        alignItems: 'center',
        background: `url(/static/banners/${image}.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        ...styles?.background,
      }}
    >
      <Container>
        <Heading variant="largeHeading" sx={{ maxWidth: '9em' }}>
          {title}
        </Heading>
      </Container>
    </Flex>
  );
}

export function PageHeadingSection({ title, small }: { title: string; small?: boolean }) {
  return (
    <Flex
      sx={{
        bg: 'backgroundMuted',
        py: [4, 5],
        minHeight: small ? ['auto', pxToRem(250)] : ['auto', pxToRem(270), pxToRem(350)],
        alignItems: 'center',
      }}
    >
      <Container sx={{ maxWidth: pxToRem(1280) }}>
        <Heading sx={{ textAlign: ['left', 'center'] }}>{title}</Heading>
      </Container>
    </Flex>
  );
}

export function PageDescriptionItems({
  items,
}: {
  items: { title: string; description: ReactNode }[];
}) {
  return (
    <Container>
      <Grid columns={[1, 2]} gap={[pxToRem(45), 6]}>
        {items.map(({ title, description }, i) => (
          <Box key={i}>
            <Heading mb={[3, 4]}>{title}</Heading>
            <Box>{description}</Box>
          </Box>
        ))}
      </Grid>
    </Container>
  );
}

export function PageInfographic({ image }: { image: string }) {
  return <Image src={`/static/infographics/${image}.png`} my={[4, 0]} />;
}

export function PageInfographicSectionWrapper({ children, sx }: WithChildren & SxProp) {
  return <Box sx={{ py: [5, null, 6], ...sx }}>{children}</Box>;
}
