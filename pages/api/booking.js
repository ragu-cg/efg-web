// Simple function which will be called via fetch to send email of booiing details.
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

  // Function to generate Rich HTML email.
  function generateEmailHTML(data) {
    const company = data.companyDetails;

    let html = `
    <h2>📚 Booking Details</h2>
    <p><strong>Course ID:</strong> ${data.courseID}</p>
    <p><strong>Class ID:</strong> ${data.classID}</p>
    <p><strong>Booking Type:</strong> ${data.bookingType}</p>
    <p><strong>Participants:</strong> ${data.participants}</p>
  
    <h3>🏢 Company Details</h3>
    <ul>
      <li><strong>Name:</strong> ${company.name}</li>
      <li><strong>UEN:</strong> ${company.uen}</li>
      <li><strong>Contact Person:</strong> ${company.contactPerson}</li>
      <li><strong>Contact Number:</strong> ${company.contactNumber}</li>
      <li><strong>Contact Email:</strong> ${company.contactEmail}</li>
    </ul>
  
    <h3>👥 Participants</h3>
  `;

    data.bookings.forEach((p, i) => {
      html += `
      <h4>Participant ${i + 1}</h4>
      <ul>
        <li><strong>Name:</strong> ${p.name}</li>
        <li><strong>Email:</strong> ${p.email}</li>
        <li><strong>Contact Number:</strong> ${p.contactNumber}</li>
        <li><strong>IC Number:</strong> ${p.icNumber}</li>
        <li><strong>DOB:</strong> ${p.dob}</li>
        <li><strong>Nationality:</strong> ${p.nationality}</li>
      </ul>
      `;
    });

    return html;
  }

  // Use in nodemailer like:
  // html: generateEmailHTML(yourBookingObject)

  const mailData = {
    from: "govind@efg.com.sg",
    to: "admin@efg.com.sg",
    subject: `Booking Message From EFG Training services pte ltd`,
    html: generateEmailHTML(req.body),
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
