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
  Button,
  Title,
  BackgroundImage,
} from "@mantine/core";

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
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "div",
  ]),
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
  rightCard: {
    backgroundImage: `linear-gradient(135deg, ${
      theme.colors[theme.primaryColor][6]
    } 0%, ${theme.colors[theme.primaryColor][4]} 100%)`,
    borderRadius: "12px",
    padding: "1.5rem",
    color: theme.white,
    "& .mantine-Text-root": {
      color: theme.white,
    },
  },
  infoLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: theme.fontSizes.xs,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    fontWeight: 600,
    marginBottom: "2px",
  },
  infoValue: {
    color: theme.white,
    fontWeight: 600,
    fontSize: theme.fontSizes.md,
  },
  infoRow: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    "&:last-of-type": {
      borderBottom: "none",
      marginBottom: 0,
    },
  },
  offlineText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.sm,
    "& a": {
      color: theme.white,
      textDecoration: "underline",
    },
  },
  leftCol: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
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
            <Text size="sm" mt="md" color="dimmed">
              *
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/payment-and-refund-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Payment &amp; Refund Policy
              </a>{" "}
              apply.
            </Text>
          </Grid.Col>
          <Grid.Col md={4}>
            <div className={classes.rightCard} style={{ marginTop: "2rem" }}>
              <div className={classes.infoRow}>
                <div className={classes.infoLabel}>Course Fee</div>
                <div className={classes.infoValue}>{course.efgCourseFee}</div>
              </div>
              <div className={classes.infoRow}>
                <div className={classes.infoLabel}>Duration</div>
                <div className={classes.infoValue}>
                  {course.efgCourseDuration}
                </div>
              </div>
              <div className={classes.infoRow}>
                <div className={classes.infoLabel}>Language</div>
                <div className={classes.infoValue}>
                  {course.efgCourseLanguage}
                </div>
              </div>
              <Button
                component="a"
                href={
                  course.courseID ? `/schedule/${course.courseID}` : "/schedule"
                }
                size="md"
                radius="xl"
                fullWidth
                mt="lg"
                mb={course.efgCourseApplicationForm ? "lg" : 0}
                sx={{
                  backgroundColor: "white",
                  color: "#1c7ed6",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                }}
              >
                Register Now
              </Button>
              {course.efgCourseApplicationForm && (
                <div>
                  <p className={classes.offlineText}>
                    Download the application form to register offline and send
                    to <a href="mailto:admin@efg.com.sg">admin@efg.com.sg</a>.
                  </p>
                  <Button
                    component="a"
                    variant="outline"
                    href={course.efgCourseApplicationForm}
                    size="sm"
                    radius="xl"
                    mr="sm"
                    mt="xs"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Company
                  </Button>
                  <Button
                    component="a"
                    variant="outline"
                    href="https://www.efg.com.sg/application-forms/EFG-Course-Registration-Individual.pdf"
                    size="sm"
                    radius="xl"
                    mt="xs"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Individual
                  </Button>
                </div>
              )}
            </div>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
