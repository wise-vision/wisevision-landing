import { FormEvent, useState } from 'react';
import { pxToRem } from 'theme';
import { Box, Button, Container, Grid, Input, Spinner, Text, Textarea } from 'theme-ui';

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

function ErrorMessage({ errorMessage }: { errorMessage?: string }) {
  return errorMessage ? <Text sx={{ color: 'error' }}>{errorMessage}</Text> : null;
}

function getInputVariant(errorMessage: string | undefined, prefix?: string | undefined) {
  return `${prefix || 'input'}${errorMessage ? 'WithError' : ''}`;
}

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [firm, setFirm] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [firmError, setFirmError] = useState<string | undefined>(undefined);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [messageError, setMessageError] = useState<string | undefined>(undefined);
  const [stage, setStage] = useState<ContactFormStage>('editing');

  async function onSubmit(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();

    const canSend = validateContact({ email, firm, name, message }) && stage !== 'inProgress';

    setMessageError(message ? undefined : '* proszę wypełnić');
    setFirmError(firm ? undefined : '* proszę wypełnić');
    setNameError(name ? undefined : '* proszę wypełnić');
    setEmailError(
      !email ? '* proszę wypełnić' : !EMAIL_REGEX.test(email) ? '* niepoprawny adres' : undefined
    );

    if (!canSend) {
      return;
    }

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
      <Grid as="form" onSubmit={onSubmit} gap={[3, 4]}>
        <Grid columns={[1, '260px 1fr']} gap={[4, null, 5]} sx={{ alignItems: 'flex-start' }}>
          <Grid gap={pxToRem(20)}>
            <Grid gap={1}>
              <ErrorMessage errorMessage={emailError} />
              <Input
                placeholder="Email*"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant={getInputVariant(emailError)}
                onBlur={() =>
                  setEmailError(
                    !email
                      ? '* proszę wypełnić'
                      : !EMAIL_REGEX.test(email)
                      ? '* niepoprawny adres'
                      : undefined
                  )
                }
              />
            </Grid>
            <Grid gap={1}>
              <ErrorMessage errorMessage={firmError} />
              <Input
                placeholder="Firma*"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                variant={getInputVariant(firmError)}
                onBlur={() => setFirmError(firm ? undefined : '* proszę wypełnić')}
              />
            </Grid>
            <Grid gap={1}>
              <ErrorMessage errorMessage={nameError} />
              <Input
                placeholder="Nazwisko*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant={getInputVariant(nameError)}
                onBlur={() => setNameError(name ? undefined : '* proszę wypełnić')}
              />
            </Grid>
          </Grid>
          <Grid gap={1}>
            <ErrorMessage errorMessage={messageError} />
            <Textarea
              placeholder="Opisz nam swój problem*"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ resize: 'none', height: '10em' }}
              variant={getInputVariant(messageError, 'textarea')}
              onBlur={() => setMessageError(message ? undefined : '* proszę wypełnić')}
            />
          </Grid>
        </Grid>
        <Button
          disabled={stage === 'inProgress'}
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
