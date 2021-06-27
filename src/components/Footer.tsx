import { FormEvent, useState } from 'react';
import { ROUTES } from 'routes';
import { pxToRem } from 'theme';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Image,
  Input,
  SxProp,
  ThemeUIStyleObject,
} from 'theme-ui';
import { AppLink } from './AppLink';

const footerLabel: ThemeUIStyleObject = {
  fontWeight: 'bold',
  textTransform: 'uppercase',
  mb: 3,
  fontSize: [5, null, 3],
};

function NewsletterForm() {
  const [email, setEmail] = useState('');

  return (
    <form action={process.env.NEXT_PUBLIC_MAILCHIMP_URL} method="POST" target="_blank">
      <Flex sx={{ maxWidth: ['100%', null, pxToRem(320)], width: '100%' }}>
        <Input
          name="EMAIL"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          sx={{ flex: 1, bg: 'backgroundMuted', px: pxToRem(24) }}
        />
        <Button type="submit">Subskrybuj</Button>
      </Flex>
    </form>
  );
}

function SocialMedia({ sx }: SxProp) {
  return (
    <Box sx={sx}>
      <Box sx={footerLabel}>Social Media</Box>
      <Flex sx={{ gap: 3 }}>
        {/* <AppLink href={ROUTES.TWITTER}>
          <Image src="static/icons/twitter.png" />
        </AppLink> */}
        <AppLink href={ROUTES.LINKEDIN}>
          <Image src="static/icons/linkedin.png" />
        </AppLink>
      </Flex>
    </Box>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box as="footer">
      <Box sx={{ bg: 'backgroundAlt', py: 4, color: 'textMuted' }}>
        <Container variant="footer" pb={2}>
          <Box mb={4}>
            <Image src="/static/logo.png" />
          </Box>
          <Grid columns={[1, 2, 3]} gap={4}>
            <Grid gap={4}>
              <Box>
                <Box sx={footerLabel}>Adres</Box>
                <Box sx={{ lineHeight: 'loose' }}>
                  WiseVision Sp. z o.o.
                  <br />
                  Myśliborska 45/2A
                  <br />
                  54-678 Warszawa
                  <br />
                  Polska
                </Box>
              </Box>
              <Box>
                <Box sx={footerLabel}>Kontakt</Box>
                <Grid gap={1}>
                  <AppLink href="mailto:info@wisevision.com">info@wisevision.com</AppLink>
                  <AppLink href="support:info@wisevision.com">support@wisevision.com</AppLink>
                </Grid>
              </Box>
            </Grid>
            <Grid gap={4}>
              <Box>
                <Box sx={footerLabel}>O firmie</Box>
                <Grid gap={1}>
                  <AppLink href={ROUTES.O_NAS}>O nas</AppLink>
                  <AppLink href={ROUTES.NOTY_PRAWNE}>Noty prawne</AppLink>
                  <AppLink href={ROUTES.RODO}>Rodo</AppLink>
                </Grid>
              </Box>
              <SocialMedia sx={{ display: ['block', null, 'none'] }} />
            </Grid>
            <Grid gap={4} sx={{ order: [-1, null, 0], gridColumn: ['-1 / 1', null, 3] }}>
              <Box>
                <Box sx={footerLabel}>Newsletter</Box>
                <NewsletterForm />
              </Box>
              <SocialMedia sx={{ display: ['none', null, 'block'] }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bg: 'primary', color: 'textAlt', textAlign: 'center', py: pxToRem(18) }}>
        <Container>wisevision {year} - all rights reserved</Container>
      </Box>
    </Box>
  );
}
