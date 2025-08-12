import * as React from 'react';
import { Html, Button, Head, Font, Preview, Section, Text } from '@react-email/components';

export interface VerificationEmailProps {
  username: string;
  otp: string;
}

// function VerificationEmail({ username, otp }: VerificationEmailProps) {
function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verification Code</title>
        <Font 
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle='normal'
        />
      </Head>
      <Preview>Verification code {otp}</Preview>
      <Section>
        <Text>Hi {username},</Text>
        <Text>Your verification code is:</Text>
        <Text style={{ fontWeight: 'bold' }}>{otp}</Text>
      </Section>
      {/* <Button href={url}>Click me</Button> */}
    </Html>
  );
}

export default VerificationEmail;
