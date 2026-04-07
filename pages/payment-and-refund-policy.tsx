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
              All payments may be made via crossed cheque payable to EFG
              Training Services Private Ltd, Bank Transfer, PayNow, or
              SkillsFuture Credit.
            </li>
            <li>
              Payment must be made on or before the course commencement date.
            </li>
            <li>
              If payment is not received, the issuance of the ID Pass and/or
              Certificate will not be processed.
            </li>
            <li>For retake examinations, the full course fee shall apply.</li>
            <li>
              For Singapore Citizens and Permanent Residents, funding is subject
              to approval by SkillsFuture Singapore (SSG). If the grant is not
              approved, the participant shall be liable to pay the full course
              fee.
            </li>
            <li>
              Please note that funding is subject to final approval and
              disbursement by SkillsFuture Singapore (SSG). If the funding is
              not approved or not disbursed for any reason after the course
              commences, the trainee/sponsoring company shall be liable to pay
              the full outstanding course fees.
              <div style={{ marginTop: "1.5rem" }}>
                <Text size="sm" weight={600} mb="xs">
                  This includes, but is not limited to:
                </Text>
                <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
                    insufficient attendance
                  </li>
                  <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
                    failure to meet assessment requirements
                  </li>
                  <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
                    ineligibility based on CPF contributions
                  </li>
                  <li style={{ marginBottom: 0, lineHeight: 1.6 }}>
                    non-compliance with SSG funding criteria
                  </li>
                </ul>
              </div>
            </li>
          </ol>
        </div>

        <Divider my="xl" />

        <div className={classes.section}>
          <Title order={3} className={classes.sectionTitle}>
            Refund and Withdrawal Policy
          </Title>
          <ol className={classes.list}>
            <li>Payment is required upon receipt of confirmation.</li>
            <li>
              A <strong>100% refund</strong> will be provided if a written
              notice of withdrawal is received by EFG at least one week before
              the course commencement.
            </li>
            <li>
              <strong>No refund</strong> will be given if EFG receives the
              notice of withdrawal within{" "}
              <strong>three (3) working days</strong> before the course
              commencement date.
            </li>
            <li>
              <strong>No refund</strong> will be issued if the participant{" "}
              <strong>fails to attend</strong> the course on the commencement
              date or <strong>discontinues mid-way</strong> through the course.
            </li>
            <li>
              Participant replacement is allowed, provided that the request is
              made prior to course commencement.
            </li>
            <li>
              If EFG cancels the course{" "}
              <strong>within three (3) working days</strong> before the course
              commencement date, the refund or alternative arrangement will be{" "}
              <strong>
                reviewed and decided by Management on a case-by-case basis
              </strong>
              .
            </li>
            <li>
              EFG reserves the right to review and decide on any exceptional
              cases at Management's discretion.
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
          href="/docs/EFG-Payment-Policy.docx"
          download="EFG-Payment-Policy.docx"
        >
          Download Payment & Refund Policy
        </a>
      </Container>
    </>
  );
}
