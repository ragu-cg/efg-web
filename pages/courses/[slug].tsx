import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from 'next';
import { Banner } from "../../components/Banner/Banner";
import { getAllCoursesWithSlug, GetPostBySlug } from '../../lib/api';
import {
  Container,
  Grid,
  createStyles,
  Text,
  Paper,
  Button,
} from "@mantine/core";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    }
  }

  const data = await GetPostBySlug(params?.slug);
  return {
    props: {
      course: data,
    },
  };
};

type courseType = {
  slug: String
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allCourses = await getAllCoursesWithSlug();

  const paths = allCourses.nodes.map((course: courseType) => ({
    params: { slug: course.slug.toString() },
  }));

  return { paths, fallback: false };
};

const styles = createStyles((theme) => ({
  content: {},

  highlight: {
    minWidth: "80px",
    display: "inline-block",
    fontWeight: 600,
  },
}));

type postData = {
  course: {
    databaseId: number,
    slug: string,
    title: string,
    uri: string,
    content: string | null,
    featuredImage: {
      node: {
        mediaItemurl: string
      }
    }
  }
};

export default ({ course }: postData) => {
  const { classes } = styles();
  return (
    <>
      <Head>
        <title>About Us | EFG</title>
        <meta name="description" content="EFG Training Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title={course.title} />
      <Container size="lg">
        <Grid>
          <Grid.Col md={8}>
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{
                __html: course.content === null ? '' : course.content,
              }}
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Paper shadow="xs" p="md" mt="xl">
              <Text>
                <span className={classes.highlight}>Fees</span>: $50
              </Text>
              <Text>
                <span className={classes.highlight}>Duration</span>: 8.0 hours
              </Text>
              <Text>
                <span className={classes.highlight}>Language</span>: English
              </Text>
              <Button size="md" radius="xl" sx={{ height: 40 }} mt={40}>
                Register now
              </Button>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
};
