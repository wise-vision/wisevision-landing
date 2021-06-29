import { FormEvent, useState } from 'react';
import { pxToRem } from 'theme';
import { Box, Button, Container, Grid, Input, Spinner, Textarea } from 'theme-ui';

export interface ContactRequestBody {
  email?: string;
  firm?: string;
  name?: string;
  message?: string;
}

type ContactFormStage = 'editing' | 'inProgress' | 'failure' | 'success';

// eslint-disable-next-line
export const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export function validateContact({ email, firm, name, message }: ContactRequestBody) {
  if (!message || !firm || !name || !email || !EMAIL_REGEX.test(email)) {
    return false;
  }

  return true;
}

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [firm, setFirm] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<ContactFormStage>('editing');

  async function onSubmit(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    setStage('inProgress');

    const res = await fetch('/api/contact', {
      body: JSON.stringify({
        email,
        firm,
        name,
        message,
      } as ContactRequestBody),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (res.status === 200) {
      setStage('success');
    } else {
      setStage('failure');
    }
  }

  const canSend = validateContact({ email, firm, name, message }) && stage !== 'inProgress';

  return (
    <Container
      sx={{
        maxWidth: pxToRem(1440),
        bg: 'backgroundMuted',
        p: [pxToRem(24), 5],
        pt: pxToRem(24),
      }}
    >
      <Box sx={{ color: 'primary', mb: 4 }}>Prosimy o uzupełnienie wszystkich pól formularza</Box>
      <Grid as="form" onSubmit={canSend ? onSubmit : undefined} gap={[3, 4]}>
        <Grid columns={[1, '260px 1fr']} gap={[4, null, 5]}>
          <Grid gap={pxToRem(20)}>
            <Input
              placeholder="Email*"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Firma*"
              value={firm}
              required
              onChange={(e) => setFirm(e.target.value)}
            />
            <Input
              placeholder="Nazwisko*"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Textarea
            placeholder="Opisz nam swój problem*"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ resize: 'none', height: '10em' }}
            required
          />
        </Grid>
        <Button
          disabled={!canSend}
          sx={{
            lineHeight: '2',
            maxWidth: pxToRem(310),
            width: '100%',
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: pxToRem(54),
          }}
        >
          {stage === 'inProgress' ? <Spinner variant="styles.spinner" /> : 'WYŚLIJ'}
        </Button>
        {stage === 'success' && (
          <Box sx={{ textAlign: 'right' }}>Formularz kontaktowy został przesłany</Box>
        )}
        {stage === 'failure' && (
          <Box sx={{ textAlign: 'right' }}>Coś poszło nie tak, spróbuj ponownie</Box>
        )}
      </Grid>
    </Container>
  );
}
