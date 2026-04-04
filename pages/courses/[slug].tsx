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
  Title,
} from "@mantine/core";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) return { notFound: true };
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

const SECTION_LABELS: Record<string, string> = {
  overview: "Course Overview",
  audience: "Who Should Attend",
  objectives: "Course Objectives",
  courseContent: "Course Content",
  prerequisites: "Pre-Requisites",
  methodology: "Training Methodology",
  assessment: "Assessment",
  trainerRatio: "Trainer to Trainee Ratio",
  attendance: "Attendance Requirements",
  medium: "Medium of Instruction",
  learningEnv: "Learning Environment",
  certifications: "Certifications",
  funding: "Funding & Claims",
};

// Ordered list of sections to render
const SECTION_ORDER = [
  "overview",
  "audience",
  "objectives",
  "courseContent",
  "prerequisites",
  "methodology",
  "medium",
  "learningEnv",
  "trainerRatio",
  "attendance",
  "assessment",
  "certifications",
  "funding",
];

const SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "table", "thead", "tbody", "tr", "th", "td", "div"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height"],
    a: ["href", "target", "rel"],
    ol: ["style", "class"],
    ul: ["class"],
    table: ["style"],
    thead: ["style"],
    tbody: ["style"],
    tr: ["style"],
    th: ["style"],
    td: ["style", "colspan", "rowspan"],
    div: ["style"],
  },
};

const useStyles = createStyles((theme) => ({
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
  leftCol: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: "8px",
    padding: "1.5rem",
  },
  section: {
    padding: "0.5rem 0",
    borderBottom: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.white}`,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
  sectionHeading: {
    display: "inline-block",
    paddingBottom: "0.25rem",
    borderBottom: `2px solid ${theme.colors.blue[5]}`,
    marginBottom: "0.5rem",
  },
  sectionContent: {
    "& ul, & ol": {
      paddingLeft: "1.5rem",
    },
    "& p": {
      marginBottom: "0.5rem",
    },
    "& p:last-child": {
      marginBottom: 0,
    },
  },
}));

type Sections = Partial<Record<keyof typeof SECTION_LABELS, string>>;

type postData = {
  course: {
    databaseId: number;
    slug: string;
    title: string;
    uri: string;
    sections?: Sections;
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
  const { classes } = useStyles();
  const sections = course.sections ?? {};

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
      <Container size="lg" pb="xl" mt="xl">
        <Grid>
          <Grid.Col md={8}>
            <div className={classes.leftCol}>
            {SECTION_ORDER.map((key) => {
              const html = sections[key as keyof typeof SECTION_LABELS];
              if (!html) return null;
              return (
                <div key={key} className={classes.section}>
                  <Title order={4} className={classes.sectionHeading}>
                    {SECTION_LABELS[key]}
                  </Title>
                  <div
                    className={classes.sectionContent}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(html, SANITIZE_OPTIONS),
                    }}
                  />
                </div>
              );
            })}
            </div>
            <Link href={"/terms-and-conditions"}>
              *Terms and Conditions apply
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
