import { Card, Text, Badge, Button, Group, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  cardContainer: {
    gap: 10,
    maxWidth: "33.3%",
    "@media (max-width: 520px)": {
      width: "100%",
    },
  },
}));

type Props = {
  courseID: string;
  schedule: {
    classID: string;
    classDate: string;
    availableSlots: number;
    session: string;
    timing: string;
    location: string;
  };
};

const ClassCard: React.FC<Props> = ({ schedule, courseID }) => {
  const { classes } = useStyles();
  const { classID, classDate, availableSlots, session, timing, location } =
    schedule;
  console.log({ schedule });
  return (
    <Card className={classes.cardContainer} shadow="sm" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{classDate}</Text>
        {availableSlots < 15 && (
          <Badge color="pink" variant="light">
            {availableSlots < 1 ? "Fully Booked!" : "On Sale"}
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        <div>
          <strong>Class ID</strong>: {classID}
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
        href={`/booking?courseID=${courseID}&classID=${classID}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        disabled={availableSlots < 1 ? true : false}
      >
        Book now!
      </Button>
    </Card>
  );
};

export default ClassCard;
