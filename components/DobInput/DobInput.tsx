import { useState } from "react";
import { TextInput, Popover, ActionIcon } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface DobInputProps {
  value: string; // dd/mm/yyyy string in state
  onChange: (value: string) => void;
  withAsterisk?: boolean;
  label?: string;
}

export function DobInput({
  value,
  onChange,
  withAsterisk,
  label = "D.O.B",
}: DobInputProps) {
  const [opened, setOpened] = useState(false);

  const parsedDate = (() => {
    const d = dayjs(value, "DD/MM/YYYY", true);
    return d.isValid() ? d.toDate() : null;
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
          placeholder="DD/MM/YYYY"
          onChange={(e) => onChange(e.currentTarget.value)}
          withAsterisk={withAsterisk}
          rightSection={
            <ActionIcon
              onClick={() => setOpened((o) => !o)}
              variant="transparent"
              title="Open calendar"
            >
              <IconCalendar size={16} />
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
