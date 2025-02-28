import { ContactForm } from 'components/ContactForm';
import { PageSEOTags } from 'components/HeadTags';
import { PageBanner } from 'components/PageWithInfographic';
import { pxToRem } from 'theme';
import { Box, Container, Flex, Heading } from 'theme-ui';

export default function Pricing() {
  return (
    <Box>
      <PageBanner image="downloads" title="Pricing" />
      <Flex
        sx={{
          bg: 'primary',
          py: 4,
          minHeight: pxToRem(230),
          alignItems: 'center',
        }}
      >
        <Container>
          <Heading sx={{ textAlign: 'center', color: 'textAlt' }}>
          Find Your Perfect Plan: Contact Us for Customized Pricing Solutions.
          </Heading>
        </Container>
      </Flex>
      <Box pt={5} pb={6}>
        <ContactForm />
        {/* TO DO, MAKE PRICING TABLE */}
      </Box>
    </Box>
  );
}

Pricing.seoTags = <PageSEOTags title="WiseVision | Pricing" />;
