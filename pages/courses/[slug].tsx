import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { Banner } from "../../components/Banner/Banner";
import { getAllCoursesWithSlug, GetPostBySlug } from "../../lib/api";
import {
  Container,
  Grid,
  createStyles,
  Text,
  Paper,
  Button,
} from "@mantine/core";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const data = await GetPostBySlug(params?.slug as string);
  return {
    props: {
      course: data,
    },
  };
};

type courseType = {
  slug: String;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allCourses = await getAllCoursesWithSlug();

  const paths = allCourses.nodes.map((course: courseType) => ({
    params: { slug: course.slug.toString() },
  }));

  return { paths, fallback: false };
};

const styles = createStyles((theme) => ({
  content: {},
  row: {
    display: "flex",

    span: {
      display: "inline-block",
      margin: "0 5px",
    },
  },
  highlight: {
    minWidth: "80px",
    display: "inline-block",
    fontWeight: 600,
  },
}));

type postData = {
  course: {
    databaseId: number;
    slug: string;
    title: string;
    uri: string;
    content: string | null;
    efgCourseFee: string;
    efgCourseDuration: string;
    efgCourseLanguage: string;
    featuredImage: {
      node: {
        mediaItemurl: string;
      };
    };
    efgCourseApplicationForm?: string;
  };
};

export default ({ course }: postData) => {
  const { classes } = styles();
  return (
    <>
      <Head>
        <title>{course.title} | EFG</title>
        <meta name="description" content="EFG Training Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner
        title={course.title}
        img={course.featuredImage?.node?.mediaItemurl}
      />
      <Container size="lg">
        <Grid>
          <Grid.Col md={8}>
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{
                __html: course.content === null ? "" : course.content,
              }}
            ></div>
            <Link href={"/terms-and-conditions"}>
              *Terms and Conditins apply
            </Link>
          </Grid.Col>
          <Grid.Col md={4}>
            <Paper shadow="xs" p="md" mt="xl">
              <Text className={classes.row}>
                <span className={classes.highlight}>Fees</span>:{" "}
                <span>{course.efgCourseFee}</span>
              </Text>
              <Text className={classes.row}>
                <span className={classes.highlight}>Duration</span>:{" "}
                <span>{course.efgCourseDuration}</span>
              </Text>
              <Text className={classes.row}>
                <span className={classes.highlight}>Language</span>:{" "}
                <span>{course.efgCourseLanguage}</span>
              </Text>
              <Button
                component="a"
                href="/schedule"
                size="md"
                radius="xl"
                sx={{ height: 40 }}
                mt={40}
              >
                Register now
              </Button>
              {course.efgCourseApplicationForm && (
                <div>
                  <p>
                    Download application form to register offline. Please
                    complete the application form and send to us for
                    registration.{" "}
                  </p>
                  <Button
                    component="a"
                    variant="light"
                    href={course.efgCourseApplicationForm}
                    size="md"
                    radius="xl"
                    sx={{ height: 40 }}
                    mt={40}
                  >
                    Download
                  </Button>
                </div>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
