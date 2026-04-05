import Head from "next/head";
import { Banner } from "../components/Banner/Banner";
import { Container, Title, Text, Divider, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
  },
  section: {
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingLeft: "1.5rem",
    margin: 0,
    "& li": {
      marginBottom: theme.spacing.sm,
      lineHeight: 1.6,
    },
    "& li:last-child": {
      marginBottom: 0,
    },
  },
}));

export default function PaymentAndRefundPolicy() {
  const { classes } = useStyles();
  return (
    <>
      <Head>
        <title>Payment & Refund Policy | EFG</title>
        <meta
          name="description"
          content="EFG Training Services Payment and Refund Policy"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Payment & Refund Policy" />
      <Container size="sm" mt={30} className={classes.wrapper}>
        <div className={classes.section}>
          <Title order={3} className={classes.sectionTitle}>
            Payment Policy
          </Title>
          <ol className={classes.list}>
            <li>
              All payments can be made by crossed cheque payable to EFG Training
              Services Private Ltd, Bank Transfer, PayNow, or SkillsFuture
              Credit.
            </li>
            <li>
              Payment must be made on or before the course commencement date.
            </li>
            <li>
              If payment is not received, the printing of the ID Pass /
              Certificate will not be possible.
            </li>
            <li>For retake exams, the full course fee applies.</li>
            <li>
              Singaporeans &amp; PRs: if a grant is not approved by SSG, full
              payment must be made by the participant.
            </li>
          </ol>
        </div>

        <Divider my="xl" />

        <div className={classes.section}>
          <Title order={3} className={classes.sectionTitle}>
            Refund Policy
          </Title>
          <ol className={classes.list}>
            <li>Payment is required upon receipt of confirmation.</li>
            <li>
              If a written notice of withdrawal is received by EFG at least one
              week before the course starts, a <strong>90% refund</strong> will
              be provided.
            </li>
            <li>
              If the notice of withdrawal is received less than one week but
              more than three working days before the course starts, a{" "}
              <strong>75% refund</strong> will be issued.
            </li>
            <li>
              <strong>No refund</strong> will be given if EFG receives the
              notice of withdrawal within three working days before the course
              starts.
            </li>
            <li>
              <strong>No refund</strong> will be issued if the participant fails
              to attend the course on the commencement date or discontinues
              mid-way through the course.
            </li>
            <li>
              Participant replacement is allowed if the request is made prior to
              course commencement.
            </li>
          </ol>
        </div>

        <Text size="sm" mt="md">
          Note: All refund and cancellation requests must be submitted in
          writing to <a href="mailto:admin@efg.com.sg">admin@efg.com.sg</a>
        </Text>

        <Divider my="xl" />

        <Text color="dimmed" size="sm" mb="lg">
          By booking with EFG Training Services, you acknowledge that you have
          read, understood, and agreed to comply with the above payment and
          refund policy.
        </Text>
        <a
          href="/pdfs/efg-payment-and-refund-policy.txt"
          download="EFG-Payment-and-Refund-Policy.txt"
        >
          Download Payment & Refund Policy
        </a>
      </Container>
    </>
  );
}
