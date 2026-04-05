import Head from "next/head";
import { FeaturesGrid } from "../components/Features/Features";
import { HeroHome } from "../components/HeroHome/HeroHome";
import { FeaturedCourseCard } from "../components/FeaturedCourseCard/FeaturedCourseCard";
import { HomeBannner } from "../components/HomeBannner/HomeBanner";
import { Container, Grid, Title, createStyles, Text } from "@mantine/core";
import { GetStaticProps } from "next";
import courseDetails from "../public/jsons/course-details.json";

const data = {
  title: "Committed to provide the best to our customers",
  description:
    "We are committed to providing exceptional value to our customers through our MOM approved courses, experienced trainers, and flexible course delivery options.",
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 2,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      textAlign: "left",
    },
  },
}));

const FEATURED_SLUGS = [
  "work-at-height-rescue-course",
  "confined-space-management",
  "perform-work-in-confined-space-operation",
  "supervise-work-in-confined-space-operation",
  "shipyard-safety-instruction-course-for-workers-hot-work-trade",
  "shipyard-safety-instruction-course-for-workers-painter-trade",
];

export const getStaticProps: GetStaticProps = async () => {
  const courseList = FEATURED_SLUGS.map((slug) => {
    const c = courseDetails[slug as keyof typeof courseDetails];
    return {
      slug,
      title: c.title,
      uri: `/courses/${slug}/`,
      featuredImage: c.featuredImage ?? null,
    };
  });
  return { props: { courseList } };
};

type postData = {
  courseList: {
    slug: string;
    title: string;
    uri: string;
    featuredImage?: {
      node?: {
        mediaItemUrl: string;
      };
    } | null;
  }[];
};

export default function Home({ courseList }: postData) {
  const { classes } = useStyles();
  const gridItems = courseList.map((item, index) => (
    <Grid.Col key={`FCC-${index}`} md={6} lg={4}>
      <FeaturedCourseCard
        title={item.title}
        link={item.uri}
        image={item.featuredImage?.node?.mediaItemUrl ?? undefined}
      />
    </Grid.Col>
  ));

  return (
    <>
      <Head>
        <title>Welcome to EFG Training Services Pte Ltd</title>
        <meta
          name="description"
          content="We are committed to providing high-quality, effective, and engaging training that empowers individuals and organizations to create safer work environments."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroHome />
      <Container size="lg" my={40}>
        <Title className={classes.title} mt={60} mb={40}>
          Courses on demand!
        </Title>

        {/* <Container size={560} p={0}>
          <Text size="sm" className={classes.description}>
            Some of our safety courses on high demand.
          </Text>
        </Container> */}
        <Grid gutter={40}>{gridItems}</Grid>
      </Container>
      <HomeBannner />
      <FeaturesGrid {...data} />
    </>
  );
}
