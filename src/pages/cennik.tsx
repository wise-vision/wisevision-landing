import { ContactForm } from 'components/ContactForm';
import { PageSEOTags } from 'components/HeadTags';
import { PageBanner } from 'components/PageWithInfographic';
import { pxToRem } from 'theme';
import { Box, Container, Flex, Heading } from 'theme-ui';

export default function Cennik() {
  return (
    <Box>
      <PageBanner image="cennik" title="Cennik" />
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
            Zapraszamy do kontaktu w celu dobrania odpowiedniej dla Was oferty.
          </Heading>
        </Container>
      </Flex>
      <Box pt={5} pb={6}>
        <ContactForm />
        {/* TO DO, MAKE CENNIK TABLE */}
      </Box>
    </Box>
  );
}

Cennik.seoTags = <PageSEOTags title="WiseVision | Cennik" />;
