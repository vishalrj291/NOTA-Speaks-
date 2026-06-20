const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
  },
})

// Verify transporter on startup (non-blocking)
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter.verify().then(() => {
    console.log('✅ Email transporter ready')
  }).catch(err => {
    console.warn('⚠️ Email transporter not configured:', err.message)
  })
}

async function sendOTP(toEmail, otp) {
  if (!process.env.EMAIL_USER) {
    console.log(`[DEV MODE] OTP for ${toEmail}: ${otp}`)
    return
  }

  await transporter.sendMail({
    from: `"NOTA Speaks" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your NOTA Speaks Verification Code',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background: #F5F0E8;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1A1A1A; margin: 0;">NOTA Speaks</h1>
          <p style="color: #6B6B6B; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin: 8px 0 0;">A Citizen. A Voice. A Nation.</p>
        </div>
        
        <div style="background: #fff; border: 1px solid rgba(26,26,26,0.1); padding: 32px; text-align: center;">
          <h2 style="font-family: Georgia, serif; font-size: 20px; color: #1A1A1A; margin: 0 0 8px;">Email Verification</h2>
          <p style="color: #6B6B6B; font-size: 14px; margin: 0 0 24px;">Enter this code to complete your application:</p>
          
          <div style="background: #F5F0E8; border: 2px solid #1A1A1A; padding: 20px 40px; display: inline-block; margin: 0 0 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1A1A1A; font-family: monospace;">${otp}</span>
          </div>
          
          <p style="color: #6B6B6B; font-size: 12px; margin: 0;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #6B6B6B; font-size: 12px; margin: 8px 0 0;">If you did not request this, please ignore this email.</p>
        </div>
        
        <p style="text-align: center; color: #A0A0A0; font-size: 11px; margin-top: 24px;">
          © ${new Date().getFullYear()} NOTA Speaks · Not affiliated with any political entity
        </p>
      </div>
    `,
  })
}

async function sendWelcome(toEmail, name) {
  if (!process.env.EMAIL_USER) {
    console.log(`[DEV MODE] Welcome email for ${toEmail}`)
    return
  }

  await transporter.sendMail({
    from: `"NOTA Speaks" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to NOTA Speaks — A Citizen. A Voice. A Nation.',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px; background: #F5F0E8;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-family: Georgia, serif; font-size: 28px; color: #1A1A1A; margin: 0;">NOTA Speaks</h1>
          <p style="color: #6B6B6B; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin: 8px 0 0;">A Citizen. A Voice. A Nation.</p>
        </div>
        
        <div style="background: #fff; border: 1px solid rgba(26,26,26,0.1); padding: 32px;">
          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1A1A; margin: 0 0 16px;">Welcome, ${name}!</h2>
          <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Thank you for joining NOTA Speaks. Your application has been received and we're excited to have you as part of our growing movement.
          </p>
          <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Together, we will build a more informed, more engaged, and more just India — one citizen at a time.
          </p>
          
          <div style="border-top: 1px solid rgba(26,26,26,0.1); padding-top: 24px; margin-top: 8px;">
            <p style="font-family: Georgia, serif; font-size: 18px; font-style: italic; color: #6B6B6B; text-align: center; margin: 0;">
              "An informed citizen is the king of a democracy."
            </p>
          </div>
        </div>
        
        <div style="background: #1A1A1A; padding: 20px 32px; margin-top: 0;">
          <p style="color: #F5F0E8; font-size: 12px; margin: 0; text-align: center;">
            © ${new Date().getFullYear()} NOTA Speaks · Not affiliated with any political entity
          </p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendOTP, sendWelcome }
