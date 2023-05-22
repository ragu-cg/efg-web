import Head from "next/head";
import { Banner } from "../components/Banner/Banner";
import { Container, createStyles, Text } from "@mantine/core";

const styles = createStyles((theme) => ({
  paragraph: {
    margin: "20px 0",
    lineHeight: 1.7,
  },

  title: {
    margin: "40px 0",
  },

  list: {
    margin: "20px 0",
    color: "inherit",
  },

  group: {
    "& > div": {
      [theme.fn.smallerThan("sm")]: {
        maxWidth: "100%",
      },
    },
  },
}));

export default function About() {
  const { classes } = styles();
  return (
    <>
      <Head>
        <title>Data Protection Act | EFG</title>
        <meta name="description" content="EFG - Data protection act" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Data Protection Act" />
      <Container size="sm">
        <Text className={classes.paragraph}>
          Personal data refers to data given by individual or organizations
          about an individual who can be identified from that data; or from that
          data and other information to which the organisation has or is likely
          to have access.
        </Text>
        <Text className={classes.paragraph}>
          Personal information details collected is for the use ONLY for course
          registration, account servicing of course-related activities, course
          survey and / or for application of course-related funding (only if
          applicable)
        </Text>
        <Text className={classes.paragraph}>
          Personal data in Singapore is protected under the Personal Data
          Protection Act 2012 (PDPA). Further details or information can refer
          to Singapore Statutes Online.
        </Text>
      </Container>
    </>
  );
}
