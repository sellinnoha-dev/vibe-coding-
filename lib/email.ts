interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Mock email service - replace with actual email provider
  // In production, use: SendGrid, Resend, Mailgun, or similar
  
  console.log('Email sent to:', to)
  console.log('Subject:', subject)
  console.log('HTML:', html)

  // For demonstration: simulate successful send
  return Promise.resolve()

  /* Example integration with Resend:
  import { Resend } from 'resend'
  
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  return resend.emails.send({
    from: 'noreply@vibepro.com',
    to,
    subject,
    html,
  })
  */
}
