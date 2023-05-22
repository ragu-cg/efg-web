import { Card, Text, Badge, Button, Group, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  cardContainer: {
    gap: 10,
    "@media (max-width: 520px)": {
      width: "100%",
    },
  },
}));

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
  const { classes } = useStyles();
  const { classId, classDate, availableSlots, session, timing, location } =
    schedule;

  return (
    <Card className={classes.cardContainer} shadow="sm" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{classDate}</Text>
        {availableSlots < 15 && (
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        <div>
          <strong>Class ID</strong>: {classId}
        </div>
        <div>
          <strong>Available Slots</strong>: {availableSlots}
        </div>
        <div>
          <strong>Session</strong>: {session}
        </div>
        <div>
          <strong>Timing</strong>: {timing}
        </div>
        <div>
          <strong>Location</strong>: {location}
        </div>
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
