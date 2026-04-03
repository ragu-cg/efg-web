import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/contact';

// Mock nodemailer so no real emails are sent
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
  contactName: 'John Doe',
  contactEmail: 'john@example.com',
  contactSubject: 'Enquiry',
  contactMessage: 'Hello there',
};

describe('POST /api/contact', () => {
  it('returns 405 for non-POST methods', async () => {
    const req = { method: 'GET', body: validBody } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('returns 400 when contactEmail is missing', async () => {
    const req = {
      method: 'POST',
      body: { ...validBody, contactEmail: '' },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when contactSubject is missing', async () => {
    const req = {
      method: 'POST',
      body: { ...validBody, contactSubject: '' },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 200 with valid body', async () => {
    const req = { method: 'POST', body: validBody } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'OK' });
  });

  it('escapes HTML in email fields before sending', async () => {
    const nodemailer = require('nodemailer');
    const sendMail = nodemailer.createTransport().sendMail as jest.Mock;
    sendMail.mockClear();

    const req = {
      method: 'POST',
      body: {
        contactName: '<script>alert(1)</script>',
        contactEmail: 'attacker@example.com',
        contactSubject: 'Test <b>bold</b>',
        contactMessage: 'Hello & goodbye',
      },
    } as NextApiRequest;
    const res = mockRes();
    await handler(req, res);

    const sentHtml: string = sendMail.mock.calls[0][0].html;
    expect(sentHtml).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(sentHtml).toContain('Test &lt;b&gt;bold&lt;/b&gt;');
    expect(sentHtml).toContain('Hello &amp; goodbye');
    expect(sentHtml).not.toContain('<script>');
  });
});
