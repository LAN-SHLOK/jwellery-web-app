import nextEnv from '@next/env';
import nodemailer from 'nodemailer';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

function createTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  if (smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

async function main() {
  const transport = createTransport();

  if (!transport) {
    console.log('[smtp] skipped: SMTP_USER / SMTP_PASS not configured.');
    return;
  }

  try {
    await transport.verify();
    console.log('[smtp] verified successfully.');
  } catch (error) {
    console.error('[smtp] verification failed:', error);
    process.exitCode = 1;
  }
}

void main();
