import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../../pages/contact';

jest.mock('@mantine/core', () => ({
  createStyles: () => () => ({ classes: {} }),
  Container: ({ children }: any) => <div>{children}</div>,
  Paper: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  TextInput: ({ name, label, placeholder, required }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} placeholder={placeholder} required={required ?? false} />
    </div>
  ),
  Textarea: ({ name, label, placeholder }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} placeholder={placeholder} />
    </div>
  ),
  Button: ({ children, type, className }: any) => (
    <button type={type ?? 'button'} className={className}>{children}</button>
  ),
  Group: ({ children }: any) => <div>{children}</div>,
  SimpleGrid: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../components/Banner/Banner', () => ({
  Banner: () => <div data-testid="banner" />,
}));
jest.mock('../../components/ContactIcons/ContactIcons', () => ({
  ContactIconsList: () => <div />,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

/**
 * Fills in the native form inputs and submits.
 * The contact page now reads values via form.elements.namedItem(),
 * so inputs must have real DOM values, not just properties on the form object.
 */
const fillAndSubmit = (overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    contactEmail: 'test@example.com',
    contactSubject: 'Test enquiry',
    contactName: 'Test User',
    contactMessage: 'Hello',
    ...overrides,
  };
  Object.entries(fields).forEach(([name, value]) => {
    const el = document.querySelector(`[name="${name}"]`) as
      | HTMLInputElement
      | HTMLTextAreaElement;
    if (el) fireEvent.change(el, { target: { value } });
  });
  fireEvent.submit(document.getElementById('contactForm') as HTMLFormElement);
};

describe('Contact page', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the contact form with required fields', () => {
    render(<Contact />);
    expect(document.querySelector('[name="contactEmail"]')).toBeInTheDocument();
    expect(document.querySelector('[name="contactSubject"]')).toBeInTheDocument();
    expect(screen.getByText('Send message')).toBeInTheDocument();
  });

  it('calls /api/contact with POST on submit', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200 });
    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('sends form field values in the request body', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200 });
    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.contactEmail).toBe('test@example.com');
      expect(body.contactSubject).toBe('Test enquiry');
    });
  });

  it('shows success notification after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({ status: 200 });
    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText('Thank you for contacting us!')).toBeInTheDocument();
    });
  });

  it('shows error notification when submission fails', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
