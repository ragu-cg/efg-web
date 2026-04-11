import { Paper, Text } from "@mantine/core";

export function FundingInfo() {
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
      <Text size="sm" color="dimmed">
        This course may be eligible for SkillsFuture funding. Subsidies may
        apply for Singapore Citizens and Permanent Residents. View the course
        page for full funding details.
      </Text>
    </Paper>
  );
}
