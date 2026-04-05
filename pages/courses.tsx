import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { Banner } from "../components/Banner/Banner";
import { FeaturedCourseCard } from "../components/FeaturedCourseCard/FeaturedCourseCard";
import courseDetailsRaw from "../public/jsons/course-details.json";
import { Container, Grid, Title, Button, createStyles } from "@mantine/core";
import { CATEGORIES } from "../lib/categories";

type CourseEntry = {
  title: string;
  slug: string;
  efgCourseUserCategory: string;
  featuredImage?: { node?: { mediaItemUrl: string } } | null;
};

type GroupedCategory = {
  categorySlug: string;
  label: string;
  courses: (CourseEntry & { slug: string })[];
};

type Props = { grouped: GroupedCategory[] };

export const getStaticProps: GetStaticProps = async () => {
  const all = Object.entries(
    courseDetailsRaw as unknown as Record<string, CourseEntry>
  ).map(([slug, c]) => ({ ...c, slug }));

  const grouped: GroupedCategory[] = CATEGORIES.map((cat) => ({
    categorySlug: cat.slug,
    label: cat.label,
    courses: all.filter((c) => c.efgCourseUserCategory === cat.categoryValue),
  })).filter((g) => g.courses.length > 0);

  return { props: { grouped } };
};

const useStyles = createStyles((theme) => ({
  categoryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottom: `2px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },
  firstCategoryHeader: {
    marginTop: 40,
  },
}));

export default function CoursesPage({ grouped }: Props) {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>All Courses | EFG Training Services</title>
        <meta name="description" content="EFG Training Services — browse all courses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="All Courses" />
      <Container size="lg" py="xl">
        {grouped.map(({ categorySlug, label, courses }, i) => (
          <div key={categorySlug}>
            <div className={`${classes.categoryHeader} ${i === 0 ? classes.firstCategoryHeader : ""}`}>
              <Title order={2}>{label}</Title>
              <Button
                component={Link}
                href={`/courses/category/${categorySlug}`}
                variant="light"
                size="sm"
                radius="xl"
              >
                View all
              </Button>
            </div>
            <Grid gutter={40}>
              {courses.map((course, i) => (
                <Grid.Col key={`${categorySlug}-${i}`} xs={12} sm={6} md={6} lg={4}>
                  <FeaturedCourseCard
                    title={course.title}
                    link={`/courses/${course.slug}`}
                    image={course.featuredImage?.node?.mediaItemUrl}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        ))}
      </Container>
    </>
  );
}
