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
  List,
  Paper,
  Checkbox,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
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
  bookingType: "company" | "individual";
  companyDetails: Company | null;
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

// interface FormErrors {
//   availableSlots: boolean;
// }

const CourseBookingForm: React.FC = () => {
  const router = useRouter();
  // State variables
  const [formSubmission, setFormSubmission] = useState<boolean>(false);
  const [formValidationError, setFormValidationError] =
    useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseClasses, setCourseClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<number>(0);
  const [availableSlotsError, setAvailableSlotsError] =
    useState<boolean>(false);
  const [companyDetails, setCompanyDetails] = useState<Company>({
    name: "",
    uen: "",
    contactPerson: "",
    contactNumber: "",
    contactEmail: "",
  });
  const [bookingTypeVisibility, setBookingTypeVisibility] =
    useState<boolean>(false);
  const [bookingType, setBookingType] = useState<"individual" | "company">(
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

  const [privacyChecked, setPrivacyChecked] = useState(false);

  // const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [notification, setNotification] = useState<string | null>(null);

  const formattedDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Fetch courses data on component mount
    axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_COURSE_SCHEDULE_API_URL,
      // url: "/jsons/booking.json",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        reqdate: formattedDate(),
      },
    })
      .then((response) => setCourses(response.data.courses))
      .catch((error) => console.error("Error fetching courses:", error));
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
      setAvailableSlotsError(false);
    }
    if (getSelectedCourse && classID) {
      setSelectedClass(classID as string);

      const selectedClassData = getSelectedCourse.courseSchedule.find(
        (classItem) => classItem.classID === classID
      );
      const slots = selectedClassData?.availableSlots || 0;
      if (slots) {
        setBookingTypeVisibility(true);
        setAvailableSlots(slots);
      } else {
        setAvailableSlotsError(true);
      }
    }
  }, [router, courses]);

  // Handle course selection change
  const handleCourseChange = (courseID: string) => {
    const getSelectedCourse = findAvailableClassesForCoruse(courseID);
    if (getSelectedCourse) {
      setCourseClasses(getSelectedCourse.courseSchedule);
      setSelectedCourse(courseID);
      setAvailableSlotsError(false);
      setBookingTypeVisibility(false);
    }
    setSelectedClass(""); // Reset classes.
  };

  // Handle class select on change
  const handleClassSelect = (value: string) => {
    const selectedOption = courseClasses.find(
      (classItem) => classItem.classID === value
    );
    if (selectedOption) {
      setSelectedClass(value);
      if (selectedOption.availableSlots > 0) {
        setAvailableSlots(selectedOption.availableSlots);
        setBookingTypeVisibility(true);
      } else {
        setAvailableSlotsError(true);
      }
    }
  };

  // Handle booking type change
  const handleBookingTypeChange = (value: string) => {
    setBookingType(value as "individual" | "company");
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
    console.log(availableSlots);
  };

  // Handle slot count change
  const handleSlotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const slotCount = Number(value);
    setParticipants(Number.isNaN(slotCount) || slotCount < 0 ? 1 : slotCount);
    console.log(slotCount);
    if (
      bookingType === "company" &&
      (!slotCount || slotCount > availableSlots)
    ) {
      setAvailableSlotsError(true);
      return false;
    } else {
      setAvailableSlotsError(false);
    }
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

  // Reset form data.
  const resetForm = () => {
    // setCourses([]);
    setSelectedClass("");
    setCourseClasses([]);
    setAvailableSlots(0);
    setParticipants(1);
    setBookingTypeVisibility(false);
    setBookingType("individual");
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
    setCompanyDetails({
      name: "",
      uen: "",
      contactPerson: "",
      contactNumber: "",
      contactEmail: "",
    });
    setPrivacyChecked(false);
    setNotification(null);
  };

  const validateForm = () => {
    const isBookingValid = bookings.every(
      (booking) =>
        booking.name.trim() !== "" &&
        booking.icNumber.trim() !== "" &&
        booking.dob.trim() !== "" &&
        booking.nationality.trim() !== "" &&
        booking.contactNumber.trim() !== ""
    );
    const isCompanyDetailsValid =
      companyDetails.name !== "" &&
      companyDetails.contactPerson !== "" &&
      companyDetails.contactNumber !== "" &&
      companyDetails.contactEmail !== ""
        ? true
        : false;
    if (
      !isBookingValid ||
      (bookingType === "company" && !isCompanyDetailsValid)
    ) {
      setFormValidationError(true);
      setNotification(
        "Please fill all the required fields with aestrik to proceed."
      );
      return false;
    } else if (!privacyChecked) {
      setFormValidationError(true);
      setNotification("Please accept the above privacy.");
      return false;
    } else {
      setFormValidationError(false);
      return true;
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    // if (formValidationError) {
    //   return;
    // }
    const booking: CourseBooking = {
      courseID: selectedCourse!,
      classID: selectedClass!,
      bookingType: bookingType!,
      companyDetails: bookingType === "company" ? companyDetails : null,
      participants: participants!,
      bookings: bookings,
    };

    axios({
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.NEXT_PUBLIC_COURSE_BOOKING_API_URL,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: booking,
    })
      .then((response) => {
        if (response.data.Status !== "Failed") {
          setFormSubmission(true);
          resetForm();
          // Call booking email api to send booking info as email to admin.
          fetch("/api/booking", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(booking),
          })
            .then((res) => {
              if (res.status === 200) {
                console.log("Successfully sent email to admin!");
              } else {
                console.log(
                  "Something went wrong while sending email to admin."
                );
              }
            })
            .catch((e) => console.log(e));
        } else {
          setFormSubmission(false);
          setNotification("Error submitting booking. Kindly call us directly.");
        }
      })
      .catch((error) => {
        console.error("Error submitting booking:", error);
        setNotification("Error submitting booking. Kindly call us directly.");
      });
  };

  return (
    <>
      <Head>
        <title>Booking Form | EFG</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Course Booking Form" />

      <Container size="md" mt={40} className={styles.bookingContainer}>
        {formSubmission && (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color="teal"
            title="Success"
            onClose={() => setNotification(null)}
            mb={30}
          >
            Successfully submitted your request for course booking. Our team
            will contact you within 24hrs.
          </Notification>
        )}
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
            value={selectedClass}
            onChange={(value: string) => handleClassSelect(value)}
            placeholder="Select a class"
            data={courseClasses.map((classItem) => ({
              value: classItem.classID,
              label: `${classItem.classDate} - ${classItem.timing}`,
            }))}
          />
        )}

        {availableSlotsError && (
          <Text color="red" my={10}>
            Sorry, the selected class is fully booked. Please try some other
            class or contact us
          </Text>
        )}

        {/* Booking Type */}
        {bookingTypeVisibility && (
          <Radio.Group
            value={bookingType}
            onChange={(event) => handleBookingTypeChange(event)}
          >
            <Radio label="Individual" value="individual" />
            <Radio label="Company" value="company" />
          </Radio.Group>
        )}

        {/* Company Details */}
        {bookingType === "company" && (
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
                withAsterisk
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
                withAsterisk
              />
              <TextInput
                label="Company Contact Number"
                value={companyDetails.contactNumber}
                onChange={(event) =>
                  handleCompanyDetailsChange(
                    "contactNumber",
                    event.currentTarget.value
                  )
                }
                withAsterisk
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
                withAsterisk
              />
            </Paper>
          </>
        )}

        {/* Number of Slots */}
        {bookingType === "company" && (
          <>
            <TextInput
              type="text"
              label="Number of Participants"
              value={participants?.toString() || ""}
              onChange={handleSlotChange}
            />
            {availableSlotsError && (
              <Text color="red">
                Only {availableSlots} slots left. Please enter a valid number
                less than {availableSlots}.
              </Text>
            )}
          </>
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
                  withAsterisk
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
                  withAsterisk
                />

                <TextInput
                  label="D.O.B"
                  value={booking.dob}
                  description="Example if the date of birth is 16th Decemeber of 1987 then enter as 1987-12-16 in Year-Month-Date format"
                  placeholder="yyyy-mm-dd"
                  onChange={(event) => {
                    handleBookingChange(
                      index,
                      "dob",
                      event.currentTarget.value
                    );
                  }}
                  withAsterisk
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
                  withAsterisk
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
                  withAsterisk
                />
              </Paper>
            </div>
          ))}

        {/* Group Booking Details */}
        {bookingType === "company" && !availableSlotsError && participants && (
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
                        withAsterisk
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
                        withAsterisk
                      />
                    </Grid.Col>
                    <Grid.Col md={6}>
                      <TextInput
                        label="D.O.B"
                        value={bookings[index]?.dob}
                        placeholder="yyyy-mm-dd"
                        onChange={(event) =>
                          handleBookingChange(
                            index,
                            "dob",
                            event.currentTarget.value
                          )
                        }
                        withAsterisk
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
                        withAsterisk
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
                        withAsterisk
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              </div>
            ))}
          </div>
        )}

        {/* Acceptance checkbox */}
        <Text mb={"1rem"}>
          I, the Applicant, consent to the collection, use, and disclosure of my
          personal data and training records to companies that access the
          Ministry of Manpower (MOM)'s Training Record System (TRS). Companies
          using the Check Workers WSH Training Records eService on the MOM
          website may verify my training records, including the following
          information:
          <List size="md" withPadding>
            <List.Item color="teal">
              Identification Number (Work Permit Number / FIN Number / NRIC
              Number){" "}
            </List.Item>
            <List.Item> Name </List.Item>
            <List.Item>
              {" "}
              Eligibility for 4 years of Safety Orientation Course (CSOC / SSIC
              / MSOC certification, if applicable){" "}
            </List.Item>
            <List.Item> Course Title </List.Item>
            <List.Item> Name of Training Provider </List.Item>
            <List.Item> Date of Assessment </List.Item>
            <List.Item> Certificate Expiry Date </List.Item>
            <List.Item> Result of Assessment</List.Item>
          </List>
        </Text>
        <Checkbox
          checked={privacyChecked}
          label="By checking this box, I confirm my consent for the disclosure of the selected
          information."
          size="md"
          mb={"1rem"}
          onChange={(event) => setPrivacyChecked(event.currentTarget.checked)}
        />

        {/* Error Notification */}
        {notification && (
          <Notification
            mb={20}
            color="red"
            title="Error"
            onClose={() => setNotification(null)}
          >
            {notification}
          </Notification>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={availableSlotsError ? true : false}
        >
          Submit
        </Button>
      </Container>
    </>
  );
};

export default CourseBookingForm;
