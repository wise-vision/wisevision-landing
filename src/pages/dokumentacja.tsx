import { AppLink } from 'components/AppLink';
import { PageBanner } from 'components/PageWithInfographic';
import { ReactNode } from 'react';
import { ROUTES } from 'routes';
import { pxToRem } from 'theme';
import { Box, Button, Container, Flex, Grid, Heading, Image } from 'theme-ui';
import { WithChildren } from 'types';

function DownloadItem({
  iconColor,
  href,
  title,
}: {
  iconColor: 'primary' | 'muted';
  href: string;
  title: ReactNode;
}) {
  return (
    <Grid gap={pxToRem(24)}>
      <Image src={`static/icons/file_${iconColor}.png`} sx={{ mx: 'auto' }} />
      <Flex sx={{ minHeight: '2.25em', alignItems: 'flex-start', justifyContent: 'center' }}>
        {title}
      </Flex>
      <AppLink href={href}>
        <Button sx={{ width: '100%' }}>Pobierz</Button>
      </AppLink>
    </Grid>
  );
}

function DownloadItemsContainer({ children, title }: { title: string } & WithChildren) {
  return (
    <Box sx={{ maxWidth: [pxToRem(340), '100%'], mx: 'auto', width: '100%' }}>
      <Heading pb={5}>{title}</Heading>
      <Grid columns={[2, '150px 150px']} gap={[3, 4, 5]}>
        {children}
      </Grid>
    </Box>
  );
}

export default function Dokumentacja() {
  return (
    <Box>
      <PageBanner image="dokumentacja" title="Dokumentacja" />
      <Container pt={[5, 6]} pb={[6, 7]}>
        <Grid columns={[1, 2]} gap={5}>
          <DownloadItemsContainer title="WHITEPAPER">
            <DownloadItem
              iconColor="primary"
              href={ROUTES.POBIERZ_SPECYFIKACJA}
              title={
                <>
                  Specyfikacja <br /> WiseVision
                </>
              }
            />
            <DownloadItem
              iconColor="primary"
              href={ROUTES.POBIERZ_DOKUMENTACJA}
              title="Dokumentacja"
            />
          </DownloadItemsContainer>
          <DownloadItemsContainer title="NOTY PRAWNE & RODO">
            <DownloadItem iconColor="muted" href={ROUTES.POBIERZ_RODO} title="RODO" />
            <DownloadItem iconColor="muted" href={ROUTES.POBIERZ_NOTY} title="Noty prawne" />
          </DownloadItemsContainer>
        </Grid>
      </Container>
    </Box>
  );
}
