import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../../pages/contact';

/**
 * Mantine components are replaced with native HTML equivalents so that
 * JSDOM can correctly resolve named form controls via e.target[name].
 * The contact page is not testing Mantine — it's testing submit behaviour.
 */
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
 * JSDOM does not fully implement HTMLFormElement's named property getter
 * (e.g. form.contactName), which is what the contact page's submit handler
 * uses (e.target.contactName.value). We define those properties directly on
 * the form element so the handler can read them correctly.
 */
const fillAndSubmit = (overrides: Record<string, string> = {}) => {
  const fields: Record<string, string> = {
    contactEmail: 'test@example.com',
    contactSubject: 'Test enquiry',
    contactName: 'Test User',
    contactMessage: 'Hello',
    ...overrides,
  };
  const form = document.getElementById('contactForm') as HTMLFormElement;
  Object.entries(fields).forEach(([name, value]) => {
    Object.defineProperty(form, name, {
      value: { value },
      configurable: true,
    });
  });
  fireEvent.submit(form);
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
    expect(document.querySelector('.notification')).toBeInTheDocument();
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
      expect(document.querySelector('.notification')?.textContent).toBe(
        'Thank you for contacting us!'
      );
    });
  });

  it('shows error notification when submission fails', async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });
    render(<Contact />);
    fillAndSubmit();

    await waitFor(() => {
      expect(document.querySelector('.notification')?.textContent).toMatch(
        /Something went wrong/i
      );
    });
  });
});
