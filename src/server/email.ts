import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// Verified sender identity used for all transactional emails.
const FROM_EMAIL = 'signup@thecontentconnect.com';

export async function sendAmbassadorApplicationThankYouEmail(email: string, name: string): Promise<void> {
  // Sends the post-submit acknowledgement to ambassador applicants.
  const response = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'You Are One Step Closer to Early Access 🎉',
    html: `
      <p>Hi ${name},</p>

      <p>Thank you for applying to be part of our early access launch. We are genuinely excited to have you here at the very start of <strong>Content Connect</strong>.</p>

      <p>We are currently reviewing all creator submissions and selecting a small group to join this first phase.</p>

      <p>We are keeping it intentionally small while we shape and refine everything.</p>

      <p>If you are selected, we will be in touch soon with next steps and everything you need to get started.</p>

      <p>If you are not included in this initial round, it simply means we are rolling things out in stages and will be opening more spots as we grow.</p>

      <p>We really appreciate you putting yourself forward. This is just the beginning.</p>

      <p>Best regards,<br/>
      Content Connect Team</p>
    `
  });
  //console.log('Email send response for ambassador:', response);
}

export async function sendCreatorApplicationThankYouEmail(email: string, name: string): Promise<void> {
  // Sends the post-submit acknowledgement to creator applicants.
  const responce = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'You Are One Step Closer to Early Access 🎉',
    html: `
      <p>Hi ${name},</p>

      <p>Thank you for applying to be part of our early access launch. We are genuinely excited to have you here at the very start of <strong>Content Connect</strong>.</p>

      <p>We are currently reviewing all creator submissions and selecting a small group to join this first phase.</p>

      <p>We are keeping it intentionally small while we shape and refine everything.</p>

      <p>If you are selected, we will be in touch soon with next steps and everything you need to get started.</p>

      <p>If you are not included in this initial round, it simply means we are rolling things out in stages and will be opening more spots as we grow.</p>

      <p>We really appreciate you putting yourself forward. This is just the beginning.</p>

      <p>Best regards,<br/>
      Content Connect Team</p>
    `
  });
  console.log('Email send response for creator:', responce);
}

export async function sendHostApplicationThankYouEmail(email: string, name: string): Promise<void> {
  // Sends the post-submit acknowledgement to host applicants.
  const response = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'You\u2019re One Step Closer to Becoming a Founding Partner',
    replyTo: FROM_EMAIL,
    html: `
      <p>Hi ${name},</p>

      <p>Thank you for your interest in joining our early access launch. We are genuinely excited to welcome you to the pre-launch of <strong>Content Connect</strong>.</p>

      <p>We are currently reviewing all hotel applications and selecting a small number of founding partners for this first phase.</p>

      <p>We are intentionally keeping this group limited as we refine the platform and collaboration process to ensure everything delivers strong, consistent value from the outset.</p>

      <p>All hotels who apply and join during this early access period will receive our founding partner pricing upon full launch, should you choose to continue beyond the initial phase.</p>

      <p>We truly appreciate your interest in being part of this from the ground up. This is just the beginning.</p>

      <p>We will be in contact via email with updates about launch day!</p>

      <p>Best regards,<br/>
      Content Connect</p>
    `,
    text: `Hi ${name},

Thank you for your interest in joining our early access launch. We are genuinely excited to welcome you to the pre-launch of Content Connect.

We are currently reviewing all hotel applications and selecting a small number of founding partners for this first phase.

We are intentionally keeping this group limited as we refine the platform and collaboration process to ensure everything delivers strong, consistent value from the outset.

All hotels who apply and join during this early access period will receive our founding partner pricing upon full launch, should you choose to continue beyond the initial phase.

We truly appreciate your interest in being part of this from the ground up. This is just the beginning.

We will be in contact via email with updates about launch day!

Best regards,
Content Connect`
  });
  console.log('Email send response for host:', response);
}
