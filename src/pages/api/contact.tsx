import { ContactRequestBody, validateContact } from 'components/ContactForm';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST_SECRET,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME_SECRET,
        pass: process.env.SMTP_PASSWORD_SECRET,
      },
      tls: { rejectUnauthorized: false },
    });

    const { email, firm, name, message } = req.body as ContactRequestBody;

    if (!validateContact(req.body)) {
      return res.status(500).send({ message: 'Body request invalid' });
    }

    const htmlTemplate = `
      Imię: <strong>${name}</strong></br>
      Email: <strong>${email}</strong></br>
      Firma: <strong>${firm}</strong></br>
      Wiadomość: <strong>${message}</strong></br>
    `;

    const mailOptions = {
      from: process.env.SMTP_USERNAME_SECRET,
      to: process.env.SMTP_USERNAME_SECRET,
      replyTo: email,
      subject: 'Formularz kontaktowy WiseVision',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({ message: 'Success' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Something went wrong while sending email' });
  }
};
