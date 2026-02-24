import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev';

export async function sendAmbassadorApplicationThankYouEmail(email: string, name: string): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thank you for applying as an Ambassador',
    html: `<p>Hi ${name},</p>
      <p>Thank you for applying to become an Ambassador with Content Connect. Our team will review your application and get in touch soon. We appreciate your interest and look forward to collaborating!</p>
      <p>Best regards,<br/>Content Connect Team</p>`
  });
}
// src/server/email.ts
// Stub implementations for email sending functions

export async function sendCreatorApplicationThankYouEmail(email: string, name: string): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thank you for applying as a Creator',
    html: `<p>Hi ${name},</p>
      <p>Thank you for applying to join Content Connect as a Creator. Our team will review your application and reach out soon. We appreciate your creativity and look forward to working together!</p>
      <p>Best regards,<br/>Content Connect Team</p>`
  });
}

export async function sendHostApplicationThankYouEmail(email: string, name: string): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thank you for applying as a Host',
    html: `<p>Hi ${name},</p>
      <p>Thank you for applying to partner with Content Connect as a Host. Our team will review your application and contact you soon. We appreciate your interest and look forward to a successful collaboration!</p>
      <p>Best regards,<br/>Content Connect Team</p>`
  });
}
