import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { escapeHtml } from '../../lib/htmlUtils';

interface CompanyDetails {
  name: string;
  uen: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
}

interface Participant {
  name: string;
  email: string;
  contactNumber: string;
  icNumber: string;
  dob: string;
  nationality: string;
  isSgResident?: string;
  applyingSsg?: string;
  employmentStatus?: string;
  monthlySalary?: string;
}

interface BookingRequest {
  courseID: string;
  classID: string;
  bookingType: 'company' | 'individual';
  companyDetails: CompanyDetails | null;
  participants: number;
  bookings: Participant[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { courseID, classID, bookingType, companyDetails, participants, bookings } =
    req.body as BookingRequest;

  if (!courseID || !classID || !bookingType || !Array.isArray(bookings) || bookings.length === 0) {
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

  const getBookingEmailTemplate = (data: BookingRequest): string => {
    const companyInfo =
      data.bookingType === 'company' && data.companyDetails
        ? `
      <h3>Company Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(data.companyDetails.name)}</li>
        <li><strong>UEN:</strong> ${escapeHtml(data.companyDetails.uen)}</li>
        <li><strong>Contact Person:</strong> ${escapeHtml(data.companyDetails.contactPerson)}</li>
        <li><strong>Contact Number:</strong> ${escapeHtml(data.companyDetails.contactNumber)}</li>
        <li><strong>Email:</strong> ${escapeHtml(data.companyDetails.contactEmail)}</li>
      </ul>
    `
        : '';

    const participantRows = data.bookings
      .map(
        (p, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.email)}</td>
          <td>${escapeHtml(p.contactNumber)}</td>
          <td>${escapeHtml(p.icNumber)}</td>
          <td>${escapeHtml(p.dob)}</td>
          <td>${escapeHtml(p.nationality)}</td>
          <td>${escapeHtml(p.isSgResident || '-')}</td>
          <td>${escapeHtml(p.applyingSsg || '-')}</td>
          <td>${escapeHtml(p.employmentStatus || '-')}</td>
          <td>${escapeHtml(p.monthlySalary || '-')}</td>
        </tr>
      `
      )
      .join('');

    const contactPerson = escapeHtml(
      data.companyDetails?.contactPerson || data.bookings[0]?.name
    );

    return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 3px solid #0b7285; background-color: #f8f8f8; padding: 10px 20px;">
        <tr>
          <td style="width: 50%; padding: 10px;">
            <img src="https://www.efg.com.sg/images/efg-logo.png" alt="EFG Logo" style="width: 90px;" />
          </td>
          <td style="width: 50%; text-align: right; padding: 10px; font-size: 14px; color: #444;">
            <strong>EFG Training Services Pte Ltd</strong><br />
            No: 3, Soon Lee Street,<br>
            01-16, Pioneer Junction,<br>
            Singapore - 627606<br />
            Email: admin@efg.com.sg
          </td>
        </tr>
      </table>

      <div style="padding: 20px;">
        <h2>Online Course Booking Details</h2>
        <p>We have received a course booking. Below are the details:</p>

        <p><strong>Course ID:</strong> ${escapeHtml(data.courseID)}</p>
        <p><strong>Class ID:</strong> ${escapeHtml(data.classID)}</p>
        <p><strong>Booking Type:</strong> ${escapeHtml(data.bookingType)}</p>
        <p><strong>Number of Participants:</strong> ${escapeHtml(String(data.participants))}</p>

        ${companyInfo}

        <h3>Participant Details</h3>
        <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <thead style="background-color: #e3f2fd;">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>IC Number</th>
              <th>DOB</th>
              <th>Nationality</th>
              <th>SG Resident / PR</th>
              <th>SSG Funding</th>
              <th>Employment Status</th>
              <th>Monthly Salary</th>
            </tr>
          </thead>
          <tbody>
            ${participantRows}
          </tbody>
        </table>

        <hr />
        <p style="font-size: 12px; color: #555;">
          I, the Applicant, consent to the collection, use, and disclosure of my personal data and training records to companies that access the Ministry of Manpower (MOM)'s Training Record System (TRS).
          Companies using the Check Workers WSH Training Records eService on the MOM website may verify my training records, including the following information:
        </p>
        <ul style="font-size: 12px; color: #555;">
          <li>Identification Number (Work Permit Number / FIN Number / NRIC Number)</li>
          <li>Name</li>
          <li>Eligibility for 4 years of Safety Orientation Course (CSOC / SSIC / MSOC certification, if applicable)</li>
          <li>Course Title</li>
          <li>Name of Training Provider</li>
          <li>Date of Assessment</li>
          <li>Certificate Expiry Date</li>
          <li>Result of Assessment</li>
        </ul>

        <p style="margin-top: 40px;">Yours sincerely,<br />
        <strong>${contactPerson}</strong></p>
      </div>
    </div>
    `;
  };

  const mailData = {
    from: 'govind@efg.com.sg',
    to: 'admin@efg.com.sg',
    subject: `Online Course Booking Message From EFG Training services pte ltd`,
    html: getBookingEmailTemplate(req.body as BookingRequest),
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
