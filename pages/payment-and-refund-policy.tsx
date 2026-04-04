import Head from "next/head";
import { Banner } from "../components/Banner/Banner";
import { Container, Title, List, Text, Divider, createStyles } from "@mantine/core";


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
}));

export default function PaymentAndRefundPolicy() {
  const { classes } = useStyles();
  return (
    <>
      <Head>
        <title>Payment & Refund Policy | EFG</title>
        <meta name="description" content="EFG Training Services Payment and Refund Policy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Payment & Refund Policy" />
      <Container size="sm" mt={30} className={classes.wrapper}>

        <div className={classes.section}>
          <Title order={3} className={classes.sectionTitle}>Payment Policy</Title>
          <List type="ordered" spacing="sm" withPadding>
            <List.Item>All payments can be made by crossed cheque payable to EFG Training Services Private Ltd, Bank Transfer, PayNow, or SkillsFuture Credit.</List.Item>
            <List.Item>Payment must be made on or before the course commencement date.</List.Item>
            <List.Item>If payment is not received, the printing of the ID Pass / Certificate will not be possible.</List.Item>
            <List.Item>For retake exams, the full course fee applies.</List.Item>
            <List.Item>Singaporeans &amp; PRs: if a grant is not approved by SSG, full payment must be made by the participant.</List.Item>
          </List>
        </div>

        <Divider my="xl" />

        <div className={classes.section}>
          <Title order={3} className={classes.sectionTitle}>Refund Policy</Title>
          <List type="ordered" spacing="sm" withPadding>
            <List.Item>Payment is required upon receipt of confirmation.</List.Item>
            <List.Item>If a written notice of withdrawal is received by EFG at least one week before the course starts, a <strong>90% refund</strong> will be provided.</List.Item>
            <List.Item>If the notice of withdrawal is received less than one week but more than three working days before the course starts, a <strong>75% refund</strong> will be issued.</List.Item>
            <List.Item><strong>No refund</strong> will be given if EFG receives the notice of withdrawal within three working days before the course starts.</List.Item>
            <List.Item><strong>No refund</strong> will be issued if the participant fails to attend the course on the commencement date or discontinues mid-way through the course.</List.Item>
            <List.Item>Participant replacement is allowed if the request is made prior to course commencement.</List.Item>
          </List>
        </div>

        <Divider my="xl" />

        <Text color="dimmed" size="sm" mb="lg">
          By booking with EFG Training Services, you acknowledge that you have read, understood, and agreed to comply with the above payment and refund policy.
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
