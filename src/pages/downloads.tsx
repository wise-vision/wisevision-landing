import { AppLink } from 'components/AppLink';
import { PageSEOTags } from 'components/HeadTags';
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
        <Button sx={{ width: '100%' }}>Download</Button>
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

export default function Downloads() {
  return (
    <Box>
      <PageBanner image="downloads" title="Downloads" />
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
              href={ROUTES.DOWNLOAD_DOCUMENTATION}
              title="Documentation"
            />
          </DownloadItemsContainer>
          <DownloadItemsContainer title="NOTES & RODO">
            <DownloadItem iconColor="muted" href={ROUTES.DOWNLOAD_RODO} title="RODO" />
            <DownloadItem iconColor="muted" href={ROUTES.DOWNLOAD_NOTES} title="NOTES" />
          </DownloadItemsContainer>
        </Grid>
      </Container>
    </Box>
  );
}

Downloads.seoTags = <PageSEOTags title="WiseVision | Downloads " />;
