import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/booking';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn((_data, cb) => cb(null, { messageId: 'test-id' })),
  }),
}));

const mockRes = () => {
  const res = {} as NextApiResponse;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const validBody = {
  courseID: 'C001',
  classID: 'CL001',
  bookingType: 'individual',
  companyDetails: null,
  participants: 1,
  bookings: [
    {
      name: 'Jane Doe',
      email: 'jane@example.com',
      contactNumber: '91234567',
      icNumber: 'S1234567A',
      dob: '1990-01-01',
      nationality: 'Singaporean',
    },
  ],
};

describe('POST /api/booking', () => {
  it('returns 405 for non-POST methods', async () => {
    const req = { method: 'GET', body: validBody } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('returns 400 when courseID is missing', async () => {
    const req = {
      method: 'POST',
      body: { ...validBody, courseID: '' },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when bookings array is empty', async () => {
    const req = {
      method: 'POST',
      body: { ...validBody, bookings: [] },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when bookings is not an array', async () => {
    const req = {
      method: 'POST',
      body: { ...validBody, bookings: null },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 200 with a valid individual booking', async () => {
    const req = { method: 'POST', body: validBody } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'OK' });
  });

  it('returns 200 with a valid company booking', async () => {
    const req = {
      method: 'POST',
      body: {
        ...validBody,
        bookingType: 'company',
        participants: 2,
        companyDetails: {
          name: 'Acme Corp',
          uen: '123456789A',
          contactPerson: 'Bob',
          contactNumber: '98765432',
          contactEmail: 'bob@acme.com',
        },
        bookings: [
          { ...validBody.bookings[0] },
          { ...validBody.bookings[0], name: 'Alice', email: 'alice@acme.com' },
        ],
      },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('escapes HTML in participant fields before sending', async () => {
    const nodemailer = require('nodemailer');
    const sendMail = nodemailer.createTransport().sendMail as jest.Mock;
    sendMail.mockClear();

    const req = {
      method: 'POST',
      body: {
        ...validBody,
        bookings: [
          {
            ...validBody.bookings[0],
            name: '<script>alert("xss")</script>',
            nationality: 'Singapore & Malaysia',
          },
        ],
      },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);

    const sentHtml: string = sendMail.mock.calls[0][0].html;
    expect(sentHtml).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(sentHtml).toContain('Singapore &amp; Malaysia');
    expect(sentHtml).not.toContain('<script>');
  });

  it('escapes HTML in company details before sending', async () => {
    const nodemailer = require('nodemailer');
    const sendMail = nodemailer.createTransport().sendMail as jest.Mock;
    sendMail.mockClear();

    const req = {
      method: 'POST',
      body: {
        ...validBody,
        bookingType: 'company',
        companyDetails: {
          name: '<b>Evil Corp</b>',
          uen: '123456789A',
          contactPerson: 'Bob <script>',
          contactNumber: '98765432',
          contactEmail: 'bob@evil.com',
        },
      },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);

    const sentHtml: string = sendMail.mock.calls[0][0].html;
    expect(sentHtml).toContain('&lt;b&gt;Evil Corp&lt;/b&gt;');
    expect(sentHtml).toContain('Bob &lt;script&gt;');
  });
});
