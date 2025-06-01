import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Section style={{ backgroundColor: '#f7fafc', padding: '40px 20px', fontFamily: 'Roboto, Verdana, sans-serif' }}>
        <Row>
          <Heading as="h2" style={{ color: '#1a202c', fontSize: '24px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={{ color: '#4a5568', fontSize: '16px', lineHeight: '24px', textAlign: 'center', marginBottom: '20px' }}>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={{ color: '#2d3748', fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px', letterSpacing: '2px' }}>
            {otp}
          </Text>
        </Row>
        <Row>
          <Text style={{ color: '#4a5568', fontSize: '16px', lineHeight: '24px', textAlign: 'center', marginBottom: '30px' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{
              backgroundColor: '#2b6cb0',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Verify Now
          </Button>
        </Row>
        <Row>
          <Text style={{ color: '#718096', fontSize: '14px', lineHeight: '20px', textAlign: 'center', marginTop: '30px' }}>
            If you find any issues or need to contact us, please reply to this email at{' '}
            <a href="mailto:theanonova@gmail.com" style={{ color: '#2b6cb0', textDecoration: 'none' }}>
              theanonova@gmail.com
            </a>.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}