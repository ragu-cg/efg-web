import React, { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { FundingInfo } from '../../components/FundingInfo/FundingInfo';

/**
 * Mantine's Radio.Group + Radio use an internal context to wire onChange.
 * We replicate that with a tiny React context so tests can fire real
 * DOM click events and have them reach the component's callbacks.
 *
 * Radio.Group → renders a <fieldset> (role="group") with its label as <legend>
 * Radio       → renders a native <input type="radio"> whose onClick fires
 *               the group's onChange with the radio's value
 * List/List.Item → plain semantic HTML equivalents
 */
jest.mock('@mantine/core', () => {
  const React = require('react');
  const RadioGroupContext = React.createContext(() => {});

  const RadioGroup = ({ children, onChange, label }: any) => (
    <RadioGroupContext.Provider value={onChange}>
      <fieldset>
        <legend>{label}</legend>
        {children}
      </fieldset>
    </RadioGroupContext.Provider>
  );

  const Radio = Object.assign(
    ({ value, label }: any) => {
      const onChange = React.useContext(RadioGroupContext);
      return (
        <label>
          {/* onClick used here because fireEvent.click is the reliable trigger
              for radio inputs in jsdom; onChange alone may not fire. */}
          <input
            type="radio"
            value={value}
            onChange={() => {}}
            onClick={() => onChange(value)}
          />
          {label}
        </label>
      );
    },
    { Group: RadioGroup }
  );

  const List = Object.assign(
    ({ children }: any) => <ul>{children}</ul>,
    { Item: ({ children }: any) => <li>{children}</li> }
  );

  return {
    Paper: ({ children }: any) => <div>{children}</div>,
    Text: ({ children }: any) => <span>{children}</span>,
    Group: ({ children }: any) => <div>{children}</div>,
    List,
    Radio,
  };
});

// ─── Stateful wrapper ────────────────────────────────────────────────────────

/** Mirrors the state management booking.tsx does around FundingInfo. */
const ControlledFundingInfo = () => {
  const [isSgResident, setIsSgResident] = useState('');
  const [applyingSsg, setApplyingSsg] = useState('');
  return (
    <FundingInfo
      isSgResident={isSgResident}
      applyingSsg={applyingSsg}
      onResidentChange={(val) => setIsSgResident(val)}
      onSsgChange={(val) => setApplyingSsg(val)}
    />
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clickRadio = (groupName: RegExp, value: 'yes' | 'no') => {
  const group = screen.getByRole('group', { name: groupName });
  fireEvent.click(within(group).getByDisplayValue(value));
};

const selectResident = (value: 'yes' | 'no') =>
  clickRadio(/singaporean or permanent resident/i, value);

const selectSsg = (value: 'yes' | 'no') =>
  clickRadio(/applying for ssg funding/i, value);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('FundingInfo', () => {
  describe('initial render', () => {
    it('shows the resident radio question', () => {
      render(<ControlledFundingInfo />);
      expect(
        screen.getByText(/singaporean or permanent resident/i)
      ).toBeInTheDocument();
    });

    it('does not show the SSG funding question', () => {
      render(<ControlledFundingInfo />);
      expect(screen.queryByText(/applying for ssg funding/i)).not.toBeInTheDocument();
    });

    it('does not show the grant criteria block', () => {
      render(<ControlledFundingInfo />);
      expect(screen.queryByText(/grant disbursement criteria/i)).not.toBeInTheDocument();
    });
  });

  describe('resident radio', () => {
    it('shows the SSG question when "Yes" is selected', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      expect(screen.getByText(/applying for ssg funding/i)).toBeInTheDocument();
    });

    it('does not show the SSG question when "No" is selected', () => {
      render(<ControlledFundingInfo />);
      selectResident('no');
      expect(screen.queryByText(/applying for ssg funding/i)).not.toBeInTheDocument();
    });

    it('hides SSG question and grant criteria when switched from "Yes" back to "No"', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      selectSsg('yes');
      selectResident('no');
      expect(screen.queryByText(/applying for ssg funding/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/grant disbursement criteria/i)).not.toBeInTheDocument();
    });
  });

  describe('SSG funding radio', () => {
    it('shows grant criteria when resident "Yes" and SSG "Yes" are both selected', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      selectSsg('yes');
      expect(screen.getByText(/grant disbursement criteria/i)).toBeInTheDocument();
    });

    it('does not show grant criteria when SSG "No" is selected', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      selectSsg('no');
      expect(screen.queryByText(/grant disbursement criteria/i)).not.toBeInTheDocument();
    });

    it('shows all three grant criteria bullet points', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      selectSsg('yes');
      expect(screen.getByText(/attendance requirement/i)).toBeInTheDocument();
      expect(screen.getByText(/^assessment:/i)).toBeInTheDocument();
      expect(screen.getByText(/^payment:/i)).toBeInTheDocument();
    });

    it('shows the Singpass disclaimer', () => {
      render(<ControlledFundingInfo />);
      selectResident('yes');
      selectSsg('yes');
      expect(screen.getByText(/singpass app/i)).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('calls onResidentChange with the selected value', () => {
      const onResidentChange = jest.fn();
      render(
        <FundingInfo
          isSgResident=""
          applyingSsg=""
          onResidentChange={onResidentChange}
          onSsgChange={jest.fn()}
        />
      );
      selectResident('yes');
      expect(onResidentChange).toHaveBeenCalledWith('yes');
    });

    it('calls onSsgChange with "" when resident changes (reset)', () => {
      const onSsgChange = jest.fn();
      render(
        <FundingInfo
          isSgResident="yes"
          applyingSsg="yes"
          onResidentChange={jest.fn()}
          onSsgChange={onSsgChange}
        />
      );
      selectResident('no');
      expect(onSsgChange).toHaveBeenCalledWith('');
    });

    it('calls onSsgChange with the selected value', () => {
      const onSsgChange = jest.fn();
      render(
        <FundingInfo
          isSgResident="yes"
          applyingSsg=""
          onResidentChange={jest.fn()}
          onSsgChange={onSsgChange}
        />
      );
      selectSsg('yes');
      expect(onSsgChange).toHaveBeenCalledWith('yes');
    });
  });
});
