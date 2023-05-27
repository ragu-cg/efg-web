import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
} from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage: "url(./images/hero-bg.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center bottom",
  },

  container: {
    height: 600,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: theme.spacing.xl * 6,
    zIndex: 1,
    position: "relative",
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      height: 500,
      paddingBottom: theme.spacing.xl * 3,
    },
  },

  title: {
    color: theme.white,
    fontSize: 60,
    maxWidth: 960,
    margin: "0 auto",
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 40,
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 960,
    margin: "0 auto",

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    margin: "0 auto",
    marginTop: theme.spacing.xl * 1.5,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

export function HeroHome() {
  const { classes } = useStyles();

  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .55) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="lg">
        <Title className={classes.title}>
          Leading training provider of WSQ and LSP courses!
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          We are a prominent provider of safety courses in Singapore, recognized
          for our excellence in training. Our highly experienced trainers are
          dedicated to imparting their knowledge and expertise, ensuring your
          successful completion of the courses.
        </Text>

        <Link href="/courses" className={classes.control}>
          <Button variant="gradient" size="xl" radius="xl">
            Explore Courses
          </Button>
        </Link>
      </Container>
    </div>
  );
}
