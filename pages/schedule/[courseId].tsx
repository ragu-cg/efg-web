import { useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { Container, Text, Anchor } from "@mantine/core";
import { Banner } from "../../components/Banner/Banner";
import ClassCard from "../../components/ClassCard/ClassCard";
import courseDetailsRaw from "../../public/jsons/course-details.json";
import styles from "../../styles/Schedule.module.css";

type CourseEntry = {
  title: string;
  slug: string;
  courseID?: string;
  [key: string]: unknown;
};
const courseDetails = courseDetailsRaw as Record<string, CourseEntry>;

type CourseScheduleItem = {
  classID: string;
  classDate: string;
  availableSlots: number;
  session: string;
  timing: string;
  location: string;
};

type Props = {
  courseId: string;
  courseName: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.values(courseDetails)
    .filter((c) => c.courseID)
    .map((c) => ({ params: { courseId: c.courseID as string } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const courseId = params?.courseId as string;
  const course = Object.values(courseDetails).find(
    (c) => c.courseID === courseId,
  );

  if (!course) return { notFound: true };

  return {
    props: {
      courseId,
      courseName: course.title,
    },
  };
};

const CourseSchedulePage: React.FC<Props> = ({ courseId, courseName }) => {
  const [schedule, setSchedule] = useState<CourseScheduleItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_COURSE_SCHEDULE_API_URL,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { reqdate: formattedDate },
    })
      .then((response) => {
        const matched = response.data.courses?.find(
          (c: { courseID: string }) => c.courseID === courseId,
        );
        setSchedule(matched?.courseSchedule ?? []);
      })
      .catch(() => setError(true));
  }, [courseId]);

  return (
    <>
      <Head>
        <title>{`${courseName} Schedule | EFG`}</title>
        <meta name="description" content="EFG Training Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title={`${courseName} — Schedule`} />
      <Container size="md" mt={60}>
        <Anchor
          href={`/courses/${Object.values(courseDetails).find((c) => c.courseID === courseId)?.slug}`}
        >
          ← Back to course
        </Anchor>

        {error && (
          <Text color="red" mt="xl">
            Unable to load schedule. Please try again later.
          </Text>
        )}

        {!error && schedule === null && (
          <Text mt="xl">Loading schedule...</Text>
        )}

        {!error && schedule !== null && schedule.length === 0 && (
          <>
            <Text mt="xl" color="dimmed">
              There are no scheduled sessions for this course at the moment.
              However, we can arrange a dedicated run for your group — whether
              you are an individual looking to join others or a company
              registering your team.{" "}
            </Text>
            <Text mt="sm" color="dimmed">
              A minimum of 3 participants is required to open a new class. For
              enquiries, please reach out to us at{" "}
              <Anchor href="tel:+6563347872">+65 6334 7872</Anchor> or{" "}
              <Anchor href="mailto:admin@efg.com.sg">admin@efg.com.sg</Anchor>.
            </Text>
            <Text mt="sm" color="dimmed">
              In the meantime, feel free to{" "}
              <Anchor href="/courses">browse our other courses</Anchor>.
            </Text>
          </>
        )}

        {!error && schedule !== null && schedule.length > 0 && (
          <div className={styles.scheduleContainer}>
            {schedule.map((item, i) => (
              <ClassCard key={i} courseID={courseId} schedule={item} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default CourseSchedulePage;
