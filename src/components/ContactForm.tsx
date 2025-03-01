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
export const EMAIL_REGEX =
  /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;

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

function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>, setEmail: (val: string) => void) {
  setEmail(e.target.value);
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

    setMessageError(message ? undefined : '* please fill this field');
    setFirmError(firm ? undefined : '* please fill this field');
    setNameError(name ? undefined : '* please fill this field');
    setEmailError(
      !email ? '* please fill this field' : !EMAIL_REGEX.test(email) ? '* wrong address' : undefined
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
      <Box sx={{ color: 'primary', mb: 4 }}>Please fill all the fields</Box>
      <Grid as="form" onSubmit={onSubmit} gap={[3, 4]}>
        <Grid columns={[1, '260px 1fr']} gap={[4, null, 5]} sx={{ alignItems: 'flex-start' }}>
          <Grid gap={pxToRem(20)}>
            <Grid gap={1}>
              <ErrorMessage errorMessage={emailError} />
              <Input
                placeholder="Email*"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e, setEmail)}
                variant={getInputVariant(emailError)}
                onBlur={() =>
                  setEmailError(
                    !email
                      ? '* please fill this field'
                      : !EMAIL_REGEX.test(email)
                        ? '* wrong address'
                        : undefined
                  )
                }
              />
            </Grid>
            <Grid gap={1}>
              <ErrorMessage errorMessage={firmError} />
              <Input
                placeholder="Company*"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                variant={getInputVariant(firmError)}
                onBlur={() => setFirmError(firm ? undefined : '* please fill this field')}
              />
            </Grid>
            <Grid gap={1}>
              <ErrorMessage errorMessage={nameError} />
              <Input
                placeholder="Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant={getInputVariant(nameError)}
                onBlur={() => setNameError(name ? undefined : '* please fill this field')}
              />
            </Grid>
          </Grid>
          <Grid gap={1}>
            <ErrorMessage errorMessage={messageError} />
            <Textarea
              placeholder="Please describe your needs*"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ resize: 'none', height: '10em' }}
              variant={getInputVariant(messageError, 'textarea')}
              onBlur={() => setMessageError(message ? undefined : '* please fill this field')}
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
          {stage === 'inProgress' ? <Spinner variant="styles.spinner" /> : 'SEND'}
        </Button>
        {stage === 'success' && (
          <Box sx={{ textAlign: 'right' }}>The contact form has been sent</Box>
        )}
        {stage === 'failure' && (
          <Box sx={{ textAlign: 'right' }}>Something went wrong, please try again</Box>
        )}
      </Grid>
    </Container>
  );
}
