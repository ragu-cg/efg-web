import Head from "next/head";
import { GetStaticProps } from "next";
import { Banner } from "../components/Banner/Banner";
import { FeaturedCourseCard } from "../components/FeaturedCourseCard/FeaturedCourseCard";
import { getAllPosts } from "../lib/api";

import { Center, Container, Grid, createStyles } from "@mantine/core";

type Course = {
  databaseId: number;
  slug: string;
  title: string;
  uri: string;
  content: string | null;
  featuredImage?: {
    node?: {
      mediaItemUrl: string;
    };
  };
  efgCourseUserCategory?: string;
};

// Define a type for the props passed to the page component
interface postData {
  courseList: Course[];
  groupedCourses: { [key: string]: Course[] }; // Grouped by `efgCourseUserCategory`
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts();
  const courseList = allPosts.nodes;

  // Sort by `efgCourseUserCategory`
  const sortedCourseList = courseList.sort((a: Course, b: Course) => {
    const categoryA = a.efgCourseUserCategory || "";
    const categoryB = b.efgCourseUserCategory || "";
    if (categoryA < categoryB) return -1;
    if (categoryA > categoryB) return 1;
    return 0;
  });

  return {
    props: {
      courseList: sortedCourseList,
    },
  };
};

const styles = createStyles((theme) => ({
  content: {},

  highlight: {
    minWidth: "80px",
    display: "inline-block",
    fontWeight: 600,
  },
}));

export default ({ courseList }: postData) => {
  const { classes } = styles();
  let previousCategory = ""; // Declare a variable to track the previous category
  const gridItems = courseList.map((item, index) => {
    // Store the HTML content for category if it hasn't been rendered before
    let categoryElement = null;

    if (
      item.efgCourseUserCategory &&
      item.efgCourseUserCategory !== previousCategory
    ) {
      previousCategory = item.efgCourseUserCategory;
      categoryElement = (
        <h2
          style={{
            width: "100%",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          {item.efgCourseUserCategory} Courses
        </h2>
      );
    }
    return (
      <>
        {categoryElement}

        <Grid.Col key={`FCC-${index}`} md={6} lg={4}>
          <FeaturedCourseCard
            title={item.title}
            link={item.uri}
            image={
              item.featuredImage &&
              item.featuredImage.node &&
              item.featuredImage.node.mediaItemUrl
            }
          />
        </Grid.Col>
      </>
    );
  });
  return (
    <>
      <Head>
        <title>About Us | EFG Training Services Pte Ltd</title>
        <meta name="description" content="EFG Training Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="All Courses" />
      <Container size="lg" mt={40}>
        <Grid gutter={40}>{gridItems}</Grid>
      </Container>
    </>
  );
};
