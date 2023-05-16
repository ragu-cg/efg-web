import { createStyles, Paper, Text, Title, Button } from "@mantine/core";
import { NodeNextRequest } from "next/dist/server/base-http/node";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  card: {
    minHeight: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",

    [theme.fn.smallerThan("sm")]: {
      minHeight: 300,
    },
  },

  featuredLink: {
    textDecoration: "none",
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
  image = image || "https://efg.com.sg/images/safety-bg.jpg";

  return (
    <Link className={classes.featuredLink} href={link}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        sx={{
          backgroundImage: `linear-gradient(270deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.85) 80%), url(${image})`,
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
        <Button
          variant="gradient"
          style={{ marginTop: "20px" }}
          gradient={{ from: "indigo", to: "cyan" }}
        >
          Learn more
        </Button>
      </Paper>
    </Link>
  );
}
