import nodemailer  from 'nodemailer'

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Địa chỉ Gmail của bạn
      pass: process.env.EMAIL_PASSWORD, // Mật khẩu ứng dụng
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default {sendEmail}
