import { Card, Text, Badge, Button, Group } from "@mantine/core";

type Props = {
  schedule: {
    classId: number;
    classDate: string;
    availableSlots: number;
    session: string;
    timing: string;
    location: string;
  };
};

const ClassCard: React.FC<Props> = ({ schedule }) => {
  const { classId, classDate, availableSlots, session, timing, location } =
    schedule;

  return (
    <Card shadow="sm" radius="md" style={{ marginRight: "20px" }} withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{classDate}</Text>
        {availableSlots < 15 && (
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        <div>Class ID: {classId}</div>
        <div>Available Slots: {availableSlots}</div>
        <div>Session: {session}</div>
        <div>Timing: {timing}</div>
        <div>Location: {location}</div>
      </Text>

      <Button
        component="a"
        href="/contact"
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Book now!
      </Button>
    </Card>
  );
};

export default ClassCard;
