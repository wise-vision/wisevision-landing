import { Container, Typography, Box, Divider, Paper, Button } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { PageSEOTags } from 'components/HeadTags';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>WiseVision | Privacy Policy</title>
        <meta name="description" content="WiseVision privacy policy and data handling practices" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 2, mb: 4 }}>
          <Link href="/" passHref>
            <Button 
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 4 }}
              variant="outlined"
            >
              Back to Home
            </Button>
          </Link>
          
          <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Last Updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>

          <Typography variant="body1" paragraph>
            WiseVision ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
          </Typography>

          <Section title="Information We Collect">
            <Typography variant="body1" paragraph>
              We collect information you provide directly to us, such as when you create an account, fill out a form, send us an email, or otherwise communicate with us. This information may include your name, email address, phone number, company name, and any other information you choose to provide.
            </Typography>
            
            <Typography variant="body1" paragraph>
              We also automatically collect certain information when you visit our website, including:
            </Typography>
            
            <ul>
              <ListItem>
                Log information (such as IP address, browser type, access time, pages viewed)
              </ListItem>
              <ListItem>
                Device information (such as device type and operating system)
              </ListItem>
              <ListItem>
                Usage data (such as how you interact with our site and services)
              </ListItem>
              <ListItem>
                Location information (as permitted by your device settings)
              </ListItem>
            </ul>
          </Section>

          <Section title="How We Use Information">
            <Typography variant="body1" paragraph>
              We use the information we collect for various business and commercial purposes, including to:
            </Typography>
            
            <ul>
              <ListItem>
                Provide, maintain, and improve our services
              </ListItem>
              <ListItem>
                Process transactions and send related information
              </ListItem>
              <ListItem>
                Send technical notices, updates, security alerts, and support messages
              </ListItem>
              <ListItem>
                Respond to your comments, questions, and customer service requests
              </ListItem>
              <ListItem>
                Monitor and analyze trends, usage, and activities related to our services
              </ListItem>
              <ListItem>
                Personalize and improve the services and provide content or features that match user profiles or interests
              </ListItem>
            </ul>
          </Section>

          <Section title="Cookies and Similar Technologies">
            <Typography variant="body1" paragraph>
              We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our website. This helps us provide you with a good experience when you browse our website and allows us to improve our site.
            </Typography>
            
            <Typography variant="body1" paragraph>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
            </Typography>
          </Section>

          <Section title="Data Security">
            <Typography variant="body1" paragraph>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </Typography>
          </Section>

          <Section title="Third-Party Services">
            <Typography variant="body1" paragraph>
              Our services may contain links to third-party websites or services that are not owned or controlled by WiseVision. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </Typography>
          </Section>

          <Section title="Data Retention">
            <Typography variant="body1" paragraph>
              We retain personal information we collect from you for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements, or to provide our services to you.
            </Typography>
          </Section>

          <Section title="Children's Privacy">
            <Typography variant="body1" paragraph>
              Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
            </Typography>
          </Section>

          <Section title="Your Rights">
            <Typography variant="body1" paragraph>
              Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, restrict processing, or object to our processing of your personal information. To exercise these rights, please contact us using the information provided below.
            </Typography>
          </Section>

          <Section title="Changes to this Privacy Policy">
            <Typography variant="body1" paragraph>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
            </Typography>
            
            <Typography variant="body1" paragraph>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </Typography>
          </Section>

          <Section title="Contact Us">
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            
            <Box sx={{ mt: 2, mb: 4, pl: 2, borderLeft: '4px solid #3b82f6' }}>
              <Typography variant="body1">WiseVision</Typography>
              <Typography variant="body1">Email: privacy@wisevision.com</Typography>
              <Typography variant="body1">Phone: +1 (555) 123-4567</Typography>
            </Box>
          </Section>
        </Paper>
      </Container>
    </>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, color: '#3b82f6', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Typography variant="body1" component="div" sx={{ mb: 1 }}>
        {children}
      </Typography>
    </li>
  );
}

// SEO Tags
PrivacyPolicy.seoTags = <PageSEOTags title="WiseVision | Privacy Policy" />;
