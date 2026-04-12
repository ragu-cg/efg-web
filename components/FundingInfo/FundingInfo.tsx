import {
  Paper,
  Text,
  Radio,
  Group,
  List,
  Checkbox,
  Stack,
  Select,
} from "@mantine/core";

const QUALIFICATIONS = [
  "No formal qualification",
  "Primary school",
  "Lower secondary",
  "GCE 'N' Level",
  "GCE 'O' Level",
  "GCE 'A' Level",
  "ITE / NTC",
  "Nitec / Higher Nitec",
  "Diploma",
  "Advanced Diploma",
  "Degree (Bachelor's)",
  "Postgraduate Diploma",
  "Master's Degree",
  "Doctorate (PhD)",
];

const SALARY_RANGES = [
  "Below $1000",
  "$1000 - $1499",
  "$1500 - $2000",
  "$2000 - $2500",
  "$2500 - $3000",
  "$3000 - $3500",
  "$3500 and above",
];

interface FundingInfoProps {
  isSgResident: string;
  applyingSsg: string;
  onResidentChange: (val: string) => void;
  onSsgChange: (val: string) => void;
  employmentStatus?: string;
  monthlySalary?: string;
  highestQualification?: string;
  onEmploymentStatusChange?: (val: string) => void;
  onMonthlySalaryChange?: (val: string) => void;
  onHighestQualificationChange?: (val: string) => void;
}

export function FundingInfo({
  isSgResident,
  applyingSsg,
  onResidentChange,
  onSsgChange,
  employmentStatus = "",
  monthlySalary = "",
  highestQualification = "",
  onEmploymentStatusChange,
  onMonthlySalaryChange,
  onHighestQualificationChange,
}: FundingInfoProps) {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      mt="md"
      mb="md"
      sx={{ borderColor: "#1c8fa0", backgroundColor: "#f0faff" }}
    >
      <Text weight={700} mb="xs">
        Government Funding Available
      </Text>

      <Radio.Group
        label="Are you a Singaporean or Permanent Resident?"
        value={isSgResident}
        onChange={(val) => {
          onResidentChange(val);
          onSsgChange("");
        }}
        mt="xs"
      >
        <Group mt="xs">
          <Radio value="yes" label="Yes" />
          <Radio value="no" label="No" />
        </Group>
      </Radio.Group>

      {isSgResident === "yes" && (
        <Radio.Group
          label="Are you applying for SSG funding?"
          value={applyingSsg}
          onChange={onSsgChange}
          mt="md"
        >
          <Group mt="xs">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </Group>
        </Radio.Group>
      )}

      {isSgResident === "yes" && applyingSsg === "yes" && (
        <>
          {/* Employment status — required for SSG grant */}
          <Radio.Group
            label="Employment Status"
            value={employmentStatus}
            onChange={onEmploymentStatusChange}
            mt="md"
          >
            <Group mt="xs">
              <Radio value="employed" label="Employed" />
              <Radio value="unemployed" label="Unemployed" />
            </Group>
          </Radio.Group>

          {employmentStatus === "employed" && (
            <Stack mt="md" spacing="xs">
              <Text size="sm" weight={600}>
                Monthly salary:
              </Text>
              <Group spacing="xs" sx={{ flexWrap: "wrap" }}>
                {SALARY_RANGES.map((range) => (
                  <Checkbox
                    key={range}
                    label={range}
                    checked={monthlySalary === range}
                    onChange={() =>
                      onMonthlySalaryChange?.(
                        monthlySalary === range ? "" : range,
                      )
                    }
                  />
                ))}
              </Group>
            </Stack>
          )}

          <Select
            label="Highest Qualification"
            placeholder="Select qualification"
            value={highestQualification || null}
            onChange={(val) => onHighestQualificationChange?.(val ?? "")}
            data={QUALIFICATIONS.map((q) => ({ value: q, label: q }))}
            mt="md"
            searchable
            clearable
          />
        </>
      )}
    </Paper>
  );
}
