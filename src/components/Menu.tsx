import { useState } from 'react';
import { ROUTES } from 'routes';
import { pxToRem } from 'theme';
import { Box, Container, Flex, Grid, Image, SxProp } from 'theme-ui';
import { AppLink } from './AppLink';

export const MENU_ID = 'menu';

function Line({ sx }: SxProp) {
  return (
    <Box
      as="span"
      sx={{
        bg: 'background',
        height: pxToRem(2),
        width: pxToRem(20),
        transition: 'standard',
        ...sx,
      }}
    />
  );
}

function HamburgerIcon({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  return (
    <Grid
      gap={1}
      sx={{ alignItems: 'center', display: ['grid', 'none'], cursor: 'pointer' }}
      onClick={() => setOpened(!opened)}
    >
      <Line
        sx={{
          transform: `translateY(${opened ? '6px' : 0}) rotateZ(${opened ? '45deg' : '0deg'})`,
        }}
      />
      <Line sx={{ opacity: opened ? 0 : 1 }} />
      <Line
        sx={{
          transform: `translateY(${opened ? '-6px' : 0}) rotateZ(${opened ? '-45deg' : '0deg'})`,
        }}
      />
    </Grid>
  );
}

export function Menu() {
  const [opened, setOpened] = useState(false);

  function close() {
    setOpened(false);
  }

  return (
    <Box
      id={MENU_ID}
      as="header"
      sx={{
        bg: 'backgroundAlt',
        py: 3,
        position: 'fixed',
        top: '0',
        left: '0',
        right: 0,
        zIndex: 'menu',
      }}
    >
      <Container sx={{ maxWidth: pxToRem(1860), px: [3, pxToRem(40)] }}>
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <AppLink onClick={close} href={ROUTES.HOME} sx={{ fontSize: '0px' }}>
            <Image src="/static/logo.png" sx={{ maxWidth: [pxToRem(140), '100%'] }} />
          </AppLink>
          <HamburgerIcon {...{ opened, setOpened }} />
          <Box
            sx={{
              gap: [pxToRem(22), pxToRem(38)],
              display: [opened ? 'flex' : 'none', 'flex'],
              position: ['absolute', 'relative'],
              left: 0,
              right: 0,
              bottom: 0,
              transform: ['translateY(100%)', 'none'],
              bg: 'backgroundAlt',
              flexDirection: ['column', 'row'],
              alignItems: ['flex-end', 'center'],
              p: [4, 0],
              pt: 0,
            }}
          >
            <AppLink onClick={close} sx={{ variant: 'links.nav' }} href={ROUTES.BLOG}>
              Blog
            </AppLink>
            <AppLink onClick={close} sx={{ variant: 'links.nav' }} href={ROUTES.DO_POBRANIA}>
              Do pobrania
            </AppLink>
            <AppLink onClick={close} sx={{ variant: 'links.nav' }} href={ROUTES.PRICING}>
              Pricing
            </AppLink>
            <AppLink onClick={close} sx={{ variant: 'links.nav' }} href={ROUTES.DOKUMENTACJA}>
              Dokumentacja
            </AppLink>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
