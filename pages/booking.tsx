import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Select,
  TextInput,
  Button,
  Radio,
  Grid,
  Notification,
  Container,
  Text,
  Paper,
} from "@mantine/core";
import { IconAt } from "@tabler/icons";

import Head from "next/head";
import { Banner } from "../components/Banner/Banner";
import axios from "axios";
import styles from "../styles/Booking.module.scss";

// Interfaces for data types
interface Course {
  courseID: string;
  courseName: string;
  courseSchedule: Class[];
}

interface Class {
  classID: string;
  classDate: string;
  availableSlots: number;
  session: string;
  timing: string;
  location: string;
}

interface CourseBooking {
  courseID: string;
  classID: string;
  bookingType: "group" | "individual";
  companyDetails: Company;
  participants: number;
  bookings: Booking[];
}

interface Company {
  name: string;
  uen: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
}

interface Booking {
  name: string;
  icNumber: string;
  dob: string;
  nationality: string;
  email: string;
  contactNumber: string;
}

const CourseBookingForm: React.FC = () => {
  const router = useRouter();
  // State variables
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseClasses, setCourseClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [companyDetails, setCompanyDetails] = useState<Company>({
    name: "",
    uen: "",
    contactPerson: "",
    contactNumber: "",
    contactEmail: "",
  });
  const [bookingTypeVisibility, setBookingTypeVisibility] =
    useState<boolean>(false);
  const [bookingType, setBookingType] = useState<"individual" | "group">(
    "individual"
  );

  const [participants, setParticipants] = useState<number>(1);
  const [bookings, setBookings] = useState<Booking[]>([
    {
      name: "",
      email: "",
      contactNumber: "",
      icNumber: "",
      dob: "",
      nationality: "",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    // Fetch courses data on component mount
    const response = axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_COURSE_SCHEDULE_API_URL,
      // url: "/jsons/booking.json",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        reqdate: formattedDate,
      },
    })
      .then((response) => setCourses(response.data.courses))
      .catch((error) => console.error("Error fetching courses:", error));
    console.log("run");
  }, []);

  // Function to find available classes for a specific course.
  const findAvailableClassesForCoruse = (courseID: string) =>
    courses.find((course) => course.courseID === courseID);

  // Use effect to set the classname and course by default form url.
  useEffect(() => {
    // Read query parameter from the URL
    const { query } = router;
    const { classID, courseID } = query;
    if (!courseID) {
      return;
    }
    const getSelectedCourse = findAvailableClassesForCoruse(courseID as string);
    if (getSelectedCourse) {
      setCourseClasses(getSelectedCourse.courseSchedule);
      setSelectedCourse(courseID as string);
    }
    if (classID) {
      setSelectedClass(classID as string);
      setBookingTypeVisibility(true);
    }
  }, [router, courses]);

  // Handle course selection change
  const handleCourseChange = (courseID: string) => {
    const getSelectedCourse = findAvailableClassesForCoruse(courseID);
    if (getSelectedCourse) {
      setCourseClasses(getSelectedCourse.courseSchedule);
      setSelectedCourse(courseID);
    }
    setSelectedClass(""); // Reset classes.
  };

  // Handle booking type change
  const handleBookingTypeChange = (value: string) => {
    setBookingType(value as "individual" | "group");
    setParticipants(1);
    setBookings([
      {
        name: "",
        email: "",
        contactNumber: "",
        icNumber: "",
        dob: "",
        nationality: "",
      },
    ]);
  };

  // Handle slot count change
  const handleSlotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const slotCount = Number(value);
    setParticipants(Number.isNaN(slotCount) || slotCount < 0 ? 1 : slotCount);
    setBookings(
      new Array(slotCount).fill({ name: "", email: "", contactNumber: "" })
    );
  };

  // Handle booking details change
  const handleCompanyDetailsChange = (field: string, value: string) => {
    setCompanyDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handle booking details change
  const handleBookingChange = (index: number, field: string, value: string) => {
    const updatedBookings = bookings.map((booking, i) => {
      if (i === index) {
        return {
          ...booking,
          [field]: value,
        };
      }
      return booking;
    });
    setBookings(updatedBookings);
  };

  // Handle form submission
  const handleSubmit = () => {
    const booking: CourseBooking = {
      courseID: selectedCourse!,
      classID: selectedClass!,
      bookingType: bookingType!,
      companyDetails: companyDetails,
      participants: participants!,
      bookings: bookings,
    };

    console.log(booking);

    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_COURSE_BOOKING_API_URL,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        reqdate: formattedDate,
      },
    })
      .then((response) => {
        console.log("Booking submitted successfully:", response.data);
        setNotification(
          "Booking submitted successfully. Our admin team will confirm your booking with in 24hrs"
        );
      })
      .catch((error) => {
        console.error("Error submitting booking:", error);
        setNotification("Error submitting booking. Kindly call us directly.");
      });
  };

  const selectedClassData = courseClasses.find(
    (classItem) => classItem.classID === selectedClass
  );
  const availableSlots = selectedClassData?.availableSlots || 0;

  // Form validation
  const validateForm = () => {
    if (!selectedCourse) {
      setNotification("Please select a course");
      return false;
    }

    if (!selectedClass) {
      setNotification("Please select a class");
      return false;
    }

    if (
      bookingType === "group" &&
      (!participants || participants < 1 || participants > availableSlots)
    ) {
      setNotification(
        `Please enter a valid number of persons (1-${availableSlots})`
      );
      return false;
    }

    const isIndividualBookingValid = bookings.every(
      (booking) =>
        booking.name.trim() !== "" &&
        booking.email.trim() !== "" &&
        booking.contactNumber.trim() !== ""
    );
    if (bookingType === "individual" && !isIndividualBookingValid) {
      setNotification("Please fill in all individual booking details");
      return false;
    }

    setNotification(null);
    return true;
  };

  return (
    <>
      <Head>
        <title>Booking Form | EFG</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Course Booking Form" />

      <Container size="md" mt={30} className={styles.bookingContainer}>
        {/* Select Course */}
        <Select
          label="Select Course"
          value={selectedCourse?.toString() || ""}
          onChange={(value: "") => handleCourseChange(value)}
          placeholder="Select a course"
          data={courses.map((course) => ({
            value: course.courseID.toString(),
            label: course.courseName,
          }))}
        />

        {/* Select Class */}
        {selectedCourse && (
          <Select
            label="Select Class"
            value={selectedClass?.toString() || ""}
            onChange={(value: "") => {
              setSelectedClass(value);
              setBookingTypeVisibility(true);
            }}
            placeholder="Select a class"
            data={courseClasses.map((classItem) => ({
              value: classItem.classID.toString(),
              label: `${classItem.classDate} - ${classItem.timing}`,
            }))}
          />
        )}

        {/* Booking Type */}
        {bookingTypeVisibility && (
          <Radio.Group
            value={bookingType}
            onChange={(event) => handleBookingTypeChange(event)}
          >
            <Radio label="Individual" value="individual" />
            <Radio label="Group" value="group" />
          </Radio.Group>
        )}

        {/* Company Details */}
        {bookingType === "group" && (
          <>
            <Text fw={700} mt={10}>
              Company details
            </Text>
            <Paper radius="md" p="md" mb={20} withBorder>
              <TextInput
                label="Company"
                value={companyDetails.name}
                onChange={(event) =>
                  handleCompanyDetailsChange("name", event.currentTarget.value)
                }
              />
              <TextInput
                label="Company UEN"
                value={companyDetails.uen}
                onChange={(event) =>
                  handleCompanyDetailsChange("uen", event.currentTarget.value)
                }
              />
              <TextInput
                label="Contact Person Name"
                value={companyDetails.contactPerson}
                onChange={(event) =>
                  handleCompanyDetailsChange(
                    "contactPerson",
                    event.currentTarget.value
                  )
                }
              />
              <TextInput
                label="Contact Person Number"
                value={companyDetails.contactNumber}
                onChange={(event) =>
                  handleCompanyDetailsChange(
                    "contactNumber",
                    event.currentTarget.value
                  )
                }
              />
              <TextInput
                label="Contact Person Email"
                value={companyDetails.contactEmail}
                onChange={(event) =>
                  handleCompanyDetailsChange(
                    "contactEmail",
                    event.currentTarget.value
                  )
                }
              />
            </Paper>
          </>
        )}

        {/* Number of Slots */}
        {bookingType === "group" && (
          <TextInput
            type="text"
            label="Number of Participants"
            value={participants?.toString() || ""}
            onChange={handleSlotChange}
          />
        )}

        {/* Individual Booking Details */}
        {bookingTypeVisibility &&
          bookingType === "individual" &&
          bookings.map((booking, index) => (
            <div key={index}>
              <Text fw={700} mt={10}>
                Personal details
              </Text>
              <Paper radius="md" p="md" mb={20} withBorder>
                <TextInput
                  label="Full Name"
                  value={booking.name}
                  onChange={(event) =>
                    handleBookingChange(
                      index,
                      "name",
                      event.currentTarget.value
                    )
                  }
                />

                <TextInput
                  label="NRIC / FIN / WP Number"
                  value={booking.icNumber}
                  type="text"
                  onChange={(event) =>
                    handleBookingChange(
                      index,
                      "icNumber",
                      event.currentTarget.value
                    )
                  }
                />

                <TextInput
                  label="D.O.B"
                  value={booking.dob}
                  onChange={(event) =>
                    handleBookingChange(index, "dob", event.currentTarget.value)
                  }
                />

                <TextInput
                  label="Nationality"
                  value={booking.nationality}
                  onChange={(event) =>
                    handleBookingChange(
                      index,
                      "nationality",
                      event.currentTarget.value
                    )
                  }
                />

                <TextInput
                  label="Email"
                  value={booking.email}
                  onChange={(event) =>
                    handleBookingChange(
                      index,
                      "email",
                      event.currentTarget.value
                    )
                  }
                />
                <TextInput
                  label="Contact Number"
                  value={booking.contactNumber}
                  onChange={(event) =>
                    handleBookingChange(
                      index,
                      "contactNumber",
                      event.currentTarget.value
                    )
                  }
                />
                <TextInput
                  label="Company"
                  value={companyDetails.name}
                  onChange={(event) =>
                    handleCompanyDetailsChange(
                      "name",
                      event.currentTarget.value
                    )
                  }
                />
              </Paper>
            </div>
          ))}

        {/* Group Booking Details */}
        {bookingType === "group" && participants && (
          <div>
            {[...Array(participants)].map((_, index) => (
              <div key={index}>
                <Text>Personal details of Person {index + 1}</Text>
                <Paper radius="md" p="md" mb={20} withBorder>
                  <Grid>
                    <Grid.Col md={6}>
                      <TextInput
                        label="Name"
                        value={bookings[index]?.name}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "name",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label="NRIC / FIN / WP Number"
                        value={bookings[index]?.icNumber}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "icNumber",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label="D.O.B"
                        value={bookings[index]?.dob}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "dob",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label="Nationality"
                        value={bookings[index]?.nationality}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "nationality",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label={`Email`}
                        value={bookings[index]?.email}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "email",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label={`Contact Number`}
                        value={bookings[index]?.contactNumber}
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "contactNumber",
                            event.currentTarget.value
                          )
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {notification && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setNotification(null)}
          >
            {notification}
          </Notification>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit}>Submit</Button>
      </Container>
    </>
  );
};

export default CourseBookingForm;
