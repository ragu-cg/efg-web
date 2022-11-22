import { createStyles, Paper, Text, Title, Button } from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  card: {
    height: 440,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
  },

  title: {
    fontFamily: `Greycliff CF ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.white,
    lineHeight: 1.2,
    fontSize: 32,
    marginTop: theme.spacing.xs,
  },

  category: {
    color: theme.white,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

interface FeaturedCourseCardProps {
  image?: string;
  title: string;
  link: string;
}

export function FeaturedCourseCard({
  image,
  title,
  link,
}: FeaturedCourseCardProps) {
  const { classes } = useStyles();
  image = image || 'safety-bg.jpg';

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{
        backgroundImage: `linear-gradient(250deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.65) 70%), url(${image})`,
      }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          Featured
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Link href={link}>
        <Button variant="white" color="dark">
          Learn more
        </Button>
      </Link>
    </Paper>
  );
}
