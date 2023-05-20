import { Card, Text, Badge, Button, Group } from "@mantine/core";

type propsData = {
  id: number;
  courseDate: string;
  availableSlots: number;
  session: string;
  timing: string;
  location: string;
};
export default function ClassCard(props: propsData) {
  return (
    <Card shadow="sm" radius="md" style={{ marginRight: "20px" }} withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{props.courseDate}</Text>
        {props.availableSlots < 15 && (
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        <div>Class ID: {props.id}</div>
        <div>Available Slots: {props.availableSlots}</div>
        <div>Session: {props.session}</div>
        <div>Timing: {props.timing}</div>
        <div>Location: {props.location}</div>
      </Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Book now!
      </Button>
    </Card>
  );
}
