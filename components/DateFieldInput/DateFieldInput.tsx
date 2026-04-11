import { useState } from "react";
import { TextInput, Popover, ActionIcon } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface DateFieldInputProps {
  value: string; // dd/mm/yyyy string in state
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  withAsterisk?: boolean;
  /** Return an error string to show, or null/undefined if valid. */
  validate?: (date: Date, raw: string) => string | null | undefined;
}

export function DateFieldInput({
  value,
  onChange,
  label,
  placeholder = "DD/MM/YYYY",
  withAsterisk,
  validate,
}: DateFieldInputProps) {
  const [opened, setOpened] = useState(false);

  const parsedDate = (() => {
    const d = dayjs(value, "DD/MM/YYYY", true);
    return d.isValid() ? d.toDate() : null;
  })();

  const error = (() => {
    if (!value) return undefined;
    if (!parsedDate) return "Enter a valid date in DD/MM/YYYY format";
    return validate ? (validate(parsedDate, value) ?? undefined) : undefined;
  })();

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom-start"
      withArrow
    >
      <Popover.Target>
        <TextInput
          label={label}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          withAsterisk={withAsterisk}
          error={error}
          rightSection={
            <ActionIcon
              onClick={() => setOpened((o) => !o)}
              variant="transparent"
              title="Open calendar"
            >
              <IconCalendar size={22} />
            </ActionIcon>
          }
        />
      </Popover.Target>
      <Popover.Dropdown>
        <Calendar
          value={parsedDate}
          onChange={(date) => {
            if (date) onChange(dayjs(date).format("DD/MM/YYYY"));
            setOpened(false);
          }}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
