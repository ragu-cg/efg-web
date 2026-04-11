import { useState } from "react";
import { Paper, Text, Radio, Group, List } from "@mantine/core";

export function FundingInfo() {
  const [isSgResident, setIsSgResident] = useState("");
  const [applyingSsg, setApplyingSsg] = useState("");

  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      mt="md"
      sx={{ borderColor: "#1c8fa0", backgroundColor: "#f0faff" }}
    >
      <Text weight={700} mb="xs">
        Government Funding Available
      </Text>

      <Radio.Group
        label="Are you a Singaporean or Permanent Resident?"
        value={isSgResident}
        onChange={(val) => {
          setIsSgResident(val);
          setApplyingSsg("");
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
          onChange={setApplyingSsg}
          mt="md"
        >
          <Group mt="xs">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </Group>
        </Radio.Group>
      )}

      {isSgResident === "yes" && applyingSsg === "yes" && (
        <Paper
          withBorder
          p="md"
          radius="md"
          mt="md"
          sx={{ borderColor: "#e0a800", backgroundColor: "#fffdf0" }}
        >
          <Text weight={700} mb="sm">
            Grant Disbursement Criteria
          </Text>
          <Text size="sm" mb="sm">
            To qualify for grant disbursement, the following conditions must be met:
          </Text>

          <List size="sm" spacing="sm" icon="➢">
            <List.Item>
              <Text size="sm" weight={600} component="span">
                Training Grant Criteria:{" "}
              </Text>
              <Text size="sm" component="span">
                To qualify for SkillsFuture Singapore (SSG), the trainee must be
                receiving at least 03 months of CPF contributions from the sponsoring
                company. Otherwise, funding will likely be rejected, and we will have
                to back charge the fees to you. Thank you for your understanding.
              </Text>
            </List.Item>
          </List>

          <Text size="sm" mt="sm" mb="sm">
            Please note that the funding is subject to final approval and
            disbursement by Skills Future Singapore (SSG). If the funding is not
            approved or released for any reason after the course, the trainee
            and/or sponsoring company shall be liable to pay the full outstanding
            course fees. This may include, but is not limited to, reasons such as
            insufficient attendance, failure to meet assessment requirements,
            ineligibility based on CPF contributions, or any other non-compliance
            with SSG funding criteria.
          </Text>

          <List size="sm" spacing="sm" icon="➢">
            <List.Item>
              <Text size="sm" weight={600} component="span">
                Attendance Requirement:{" "}
              </Text>
              <Text size="sm" component="span">
                The Trainee must achieve 100% attendance.
              </Text>
            </List.Item>
            <List.Item>
              <Text size="sm" weight={600} component="span">
                Assessment:{" "}
              </Text>
              <Text size="sm" component="span">
                The Trainee must pass all prescribed examinations or assessments.
              </Text>
            </List.Item>
            <List.Item>
              <Text size="sm" weight={600} component="span">
                Payment:{" "}
              </Text>
              <Text size="sm" component="span">
                All course fees must be paid in full on or before course date.
              </Text>
            </List.Item>
          </List>

          <Text size="xs" color="dimmed" mt="sm">
            Please note that EFG Training Services will not be held liable for any
            rejected grant applications if the required procedures and documentation
            is not followed.
          </Text>
          <Text size="xs" color="dimmed" mt="xs">
            Singapore Citizens / Singapore Permanent Residents applying for grants
            — mandatory to take attendance using Singpass App.
          </Text>
        </Paper>
      )}
    </Paper>
  );
}
