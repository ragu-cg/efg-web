import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import sanitizeHtml from "sanitize-html";
import { Banner } from "../../components/Banner/Banner";
import courseDetails from "../../public/jsons/course-details.json";
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

  const slug = params?.slug as string;
  const course = courseDetails[slug as keyof typeof courseDetails] ?? null;
  if (!course) return { notFound: true };
  return { props: { course } };
};


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(courseDetails).map((slug) => ({
    params: { slug },
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
        mediaItemUrl: string;
      };
    };
    efgCourseApplicationForm?: string;
    courseID?: string;
  };
};

export default ({ course }: postData) => {
  const { classes } = styles();
  return (
    <>
      <Head>
        <title>{`${course.title} | EFG`}</title>
        <meta name="description" content="EFG Training Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner
        title={course.title}
        img={course.featuredImage?.node?.mediaItemUrl}
      />
      <Container size="lg">
        <Grid>
          <Grid.Col md={8}>
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(course.content ?? "", {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ["src", "alt", "width", "height"],
                    a: ["href", "target", "rel"],
                  },
                }),
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
                href={course.courseID ? `/schedule/${course.courseID}` : "/schedule"}
                size="md"
                radius="xl"
                sx={{ height: 40 }}
                mt={40}
                mb={40}
              >
                Register now
              </Button>
              {course.efgCourseApplicationForm && (
                <div>
                  <p>
                    Download the below application forms to register offline.
                    Please complete the application form and send to us back to
                    <a href="mailto:admin@efg.com.sg"> admin@efg.com.sg</a> for
                    registration.{" "}
                  </p>
                  <Button
                    component="a"
                    variant="light"
                    href={course.efgCourseApplicationForm}
                    size="md"
                    radius="xl"
                    sx={{ height: 40 }}
                    mt={20}
                    mr={20}
                  >
                    Company
                  </Button>
                  <Button
                    component="a"
                    variant="light"
                    href="https://www.efg.com.sg/application-forms/EFG-Course-Registration-Individual.pdf"
                    size="md"
                    radius="xl"
                    sx={{ height: 40 }}
                    mt={20}
                  >
                    Individual
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
