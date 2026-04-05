import Head from "next/head";
import Link from "next/link";
import { FeaturesGrid } from "../components/Features/Features";
import { HeroHome } from "../components/HeroHome/HeroHome";
import { HomeBannner } from "../components/HomeBannner/HomeBanner";
import { Container, Grid, Title, Text, Button, createStyles } from "@mantine/core";
import { GetStaticProps } from "next";
import { CATEGORIES } from "../lib/categories";

const data = {
  title: "Committed to provide the best to our customers",
  description:
    "We are committed to providing exceptional value to our customers through our MOM approved courses, experienced trainers, and flexible course delivery options.",
};

const useStyles = createStyles((theme) => ({
  sectionTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    textAlign: "center",
    [theme.fn.smallerThan("sm")]: {
      fontSize: 28,
      textAlign: "left",
    },
  },
  categoryCard: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    position: "relative" as const,
    transition: "transform 120ms ease, box-shadow 120ms ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: theme.shadows.lg,
    },
  },
  cardContent: {
    position: "relative" as const,
    zIndex: 1,
  },
  cardTitle: {
    color: theme.white,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1.2,
    marginBottom: theme.spacing.xs,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.78)",
    fontSize: theme.fontSizes.sm,
    lineHeight: 1.5,
    marginBottom: theme.spacing.md,
  },
}));

type CategoryProp = {
  slug: string;
  label: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    categories: CATEGORIES.map(({ slug, label, description, gradientFrom, gradientTo }) => ({
      slug,
      label,
      description,
      gradientFrom,
      gradientTo,
    })),
  },
});

export default function Home({ categories }: { categories: CategoryProp[] }) {
  const { classes } = useStyles();

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
      <Container size="lg" my={60}>
        <Title className={classes.sectionTitle} mb={8}>
          Browse by Category
        </Title>
        <Text align="center" color="dimmed" mb={40}>
          Find the right course for your role and industry.
        </Text>
        <Grid gutter={24}>
          {categories.map((cat) => (
            <Grid.Col key={cat.slug} xs={12} sm={6} md={3}>
              <Link href={`/courses/category/${cat.slug}`} style={{ textDecoration: "none" }}>
                <div
                  className={classes.categoryCard}
                  style={{
                    background: `linear-gradient(150deg, ${cat.gradientFrom} 0%, ${cat.gradientTo} 100%)`,
                  }}
                >
                  <div className={classes.cardContent}>
                    <div className={classes.cardTitle}>{cat.label}</div>
                    <div className={classes.cardDesc}>{cat.description}</div>
                    <Button size="xs" radius="xl" variant="white" color="dark">
                      View courses
                    </Button>
                  </div>
                </div>
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      <HomeBannner />
      <FeaturesGrid {...data} />
    </>
  );
}
