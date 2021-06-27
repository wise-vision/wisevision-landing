import { PageSEOTags } from 'components/HeadTags';
import { PageBanner } from 'components/PageWithInfographic';
import { FormEvent, useState } from 'react';
import { pxToRem } from 'theme';
import { Box, Button, Container, Flex, Grid, Heading, Input, Textarea } from 'theme-ui';

export default function Cennik() {
  const [email, setEmail] = useState('');
  const [firm, setFirm] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function onSubmit(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    window.alert(`submit form`);
  }

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
        <Container sx={{ maxWidth: pxToRem(1440), bg: 'backgroundMuted', p: 5, pt: pxToRem(24) }}>
          <Box sx={{ color: 'primary', mb: 4 }}>
            Prosimy o uzupełnienie wszystkich pól formularza
          </Box>
          <Box as="form" onSubmit={onSubmit}>
            <Grid columns="260px 1fr" gap={5} mb={4}>
              <Grid gap={pxToRem(20)}>
                <Input
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Firma*"
                  value={firm}
                  onChange={(e) => setFirm(e.target.value)}
                />
                <Input
                  placeholder="Nazwisko*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Textarea
                placeholder="Treść wiadomości*"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Grid>
            <Button sx={{ lineHeight: '2', width: pxToRem(310), ml: 'auto', display: 'block' }}>
              WYŚLIJ
            </Button>
          </Box>
        </Container>
        {/* TO DO, MAKE CENNIK TABLE */}
      </Box>
    </Box>
  );
}

Cennik.seoTags = <PageSEOTags title="WiseVision | Cennik" />;
