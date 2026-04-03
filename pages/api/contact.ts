import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { escapeHtml } from '../../lib/htmlUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contactName, contactEmail, contactSubject, contactMessage } = req.body;

  if (!contactEmail || !contactSubject) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
    secure: true,
  });

  const mailData = {
    from: 'govind@efg.com.sg',
    to: 'admin@efg.com.sg',
    subject: `Contact Message From EFG Training services pte ltd`,
    html: `
    <div><strong>Name:</strong> ${escapeHtml(contactName)}</div>
    <br/>
    <div><strong>Email:</strong> ${escapeHtml(contactEmail)}</div>
    <br/>
    <div><strong>Regarding:</strong> ${escapeHtml(contactSubject)}</div>
    <br/>
    <div><strong>Message:</strong> ${escapeHtml(contactMessage)}</div>
    <br/>
    <p>Sent from: ${escapeHtml(contactEmail)}</p>`,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });

  res.status(200).json({ status: 'OK' });
}
