import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { Banner } from "../../../components/Banner/Banner";
import { FeaturedCourseCard } from "../../../components/FeaturedCourseCard/FeaturedCourseCard";
import courseDetailsRaw from "../../../public/jsons/course-details.json";
import { Container, Grid, Text, Anchor } from "@mantine/core";
import { CATEGORIES, CATEGORY_BY_SLUG } from "../../../lib/categories";

type CourseEntry = {
  title: string;
  slug: string;
  efgCourseUserCategory: string;
  featuredImage?: { node?: { mediaItemUrl: string } } | null;
};

type Props = {
  label: string;
  description: string;
  courses: (CourseEntry & { slug: string })[];
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: CATEGORIES.map((c) => ({ params: { category: c.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categorySlug = params?.category as string;
  const cat = CATEGORY_BY_SLUG[categorySlug];
  if (!cat) return { notFound: true };

  const courses = Object.entries(
    courseDetailsRaw as unknown as Record<string, CourseEntry>
  )
    .map(([slug, c]) => ({ ...c, slug }))
    .filter((c) => c.efgCourseUserCategory === cat.categoryValue);

  return {
    props: { label: cat.label, description: cat.description, courses },
  };
};

export default function CategoryPage({ label, description, courses }: Props) {
  return (
    <>
      <Head>
        <title>{`${label} | EFG Training Services`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title={label} />
      <Container size="lg" pb="xl" mt="xl">
        <Anchor component={Link} href="/courses" size="sm" mb="md" display="inline-block">
          ← All Courses
        </Anchor>
        <Text color="dimmed" mb="xl">{description}</Text>
        <Grid gutter={40}>
          {courses.map((course, i) => (
            <Grid.Col key={i} md={6} lg={4}>
              <FeaturedCourseCard
                title={course.title}
                link={`/courses/${course.slug}`}
                image={course.featuredImage?.node?.mediaItemUrl}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </>
  );
}
