// Simple function to send email when submitted via contact form.
export default async function (req, res) {
  let nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
    secure: true,
  });
  console.log(req.body);
  const mailData = {
    from: "govind@efg.com.sg",
    to: "admin@efg.com.sg",
    subject: `Contact Message From EFG Training services pte ltd`,
    html: `
    <div><strong>Name:</strong> ${req.body.contactName}</div>
    <br/>
    <div><strong>Email:</strong> ${req.body.contactEmail}</div>
    <br/>
    <div><strong>Regarding:</strong> ${req.body.contactSubject}</div>
    <br/>
    <div><strong>Message:</strong> ${req.body.contactMessage}</div>
    <br/>
    <p>Sent from:
      ${req.body.contactEmail}</p>`,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
  res.status(200).json({ status: "OK" });
}
