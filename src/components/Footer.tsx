import React, { useState } from 'react';
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
import { MySxProp } from '../types';

const footerLabel: ThemeUIStyleObject = {
  fontWeight: 'bold',
  textTransform: 'uppercase',
  mb: 3,
  fontSize: [5, null, 3],
};

// function NewsletterForm() {
//   const [email, setEmail] = useState('');

//   return (
//     <form action={process.env.NEXT_PUBLIC_MAILCHIMP_URL} method="POST" target="_blank">
//       <Flex sx={{ maxWidth: ['100%', null, pxToRem(320)], width: '100%' }}>
//         <Input
//           name="EMAIL"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="email"
//           sx={{ flex: 1, bg: 'backgroundMuted', px: pxToRem(24) }}
//         />
//         <Button type="submit">Subscribe</Button>
//       </Flex>
//     </form>
//   );
// }

function SocialMedia({ sx }: MySxProp) {
  return (
    <Box sx={sx}>
      <Box sx={footerLabel}>Social Media</Box>
      <Flex sx={{ gap: 3 }}>
        {/* <AppLink href={ROUTES.TWITTER}>
          <Image src="static/icons/twitter.png" />
        </AppLink> */}
        <AppLink href={ROUTES.LINKEDIN}>
          <Image src="static/icons/linkedin.png" alt="LinkedIn" />
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
            <Image src="/static/logo.png" alt="WiseVision Logo" sx={{ maxWidth: [pxToRem(140), '100%'] }} />
          </Box>
          <Grid columns={[1, 2, 3]} gap={4}>
            <Grid gap={4}>
              <Box>
                <Box sx={footerLabel}>Address</Box>
                <Box sx={{ lineHeight: 'loose' }}>
                  Inter Plus Sp. z o.o.
                  <br />
                  ul. Swietokrzyska 30/63
                  <br />
                  00-116 Warsaw
                  <br />
                  Poland
                </Box>
              </Box>
              <Box>
                {/* <Box sx={footerLabel}>Newsletter</Box> */}
                {/* <NewsletterForm /> */}
              </Box>
            </Grid>
            <Grid gap={4}>
              <Box>
                <Box sx={footerLabel}>About company</Box>
                <Grid gap={1}>
                  <AppLink href={ROUTES.O_NAS}>About company</AppLink>
                  <AppLink href={ROUTES.NOTY_PRAWNE}>Legal Notes</AppLink>
                  <AppLink href={ROUTES.RODO}>RODO</AppLink>
                </Grid>
              </Box>
              <SocialMedia sx={{ display: ['block', null, 'none'] }} />
            </Grid>
            <Grid gap={4} sx={{ order: [-1, null, 0], gridColumn: ['-1 / 1', null, 3] }}>
              <Box>
                <Box sx={footerLabel}>Contact</Box>
                <Grid gap={1}>
                  <AppLink href="mailto:office@wisevision.tech">office@wisevision.tech</AppLink>
                </Grid>
              </Box>
              <SocialMedia sx={{ display: ['none', null, 'block'] }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bg: 'primary', color: 'textAlt', textAlign: 'center', py: pxToRem(18) }}>
        <Container>WiseVision {year} - all rights reserved</Container>
      </Box>
    </Box>
  );
}
