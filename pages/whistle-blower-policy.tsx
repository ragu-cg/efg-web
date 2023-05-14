import Head from "next/head";
import { Banner } from "../components/Banner/Banner";
import {
  Container,
  Grid,
  Title,
  createStyles,
  Text,
  List,
  Group,
  Divider,
  ThemeIcon,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons";
import { UserCard } from "../components/UserCard/UserCard";

const data = [
  {
    avatar: "https://efg.com.sg/images/rosli.jpg",
    name: "Mr. Rosli Bin Pitchay",
    email: "rosli@efg.com.sg",
    job: "Director",
  },
  {
    avatar: "https://efg.com.sg/images/naseer.jpg",
    name: "Mr. Nasser",
    email: "nasser@efg.com.sg",
    job: "Director",
  },
  {
    avatar: "https://efg.com.sg/images/govind.jpg",
    name: "Mr. Govind",
    email: "govind@efg.com.sg",
    job: "Director",
  },
];

const styles = createStyles((theme) => ({
  paragraph: {
    margin: "20px 0",
    lineHeight: 1.7,
  },

  title: {
    margin: "40px 0",
  },

  list: {
    margin: "20px 0",
    color: "inherit",
  },

  group: {
    "& > div": {
      [theme.fn.smallerThan("sm")]: {
        maxWidth: "100%",
      },
    },
  },
}));

const directors = data.map((director) => {
  return <UserCard key={director.avatar} {...director} />;
});

export default function About() {
  const { classes } = styles();
  return (
    <>
      <Head>
        <title>Whistle Blower Policy | EFG</title>
        <meta name="description" content="EFG - Whistle Blower Policy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Banner title="Whistle Blower Policy" />
      <Container size="sm">
        <Text className={classes.paragraph}>
          A whistle blower is a person, who exposes information or activity
          suspected of wrongdoings at work that is deemed illegal, illicit,
          unsafe, or a waste, fraud, or abuse of authority. It includes criminal
          activities, corruption, bribery, financial fraud, danger to workplace
          health and safety, failure to comply with legal obligations or
          regulations, breach of Company policies and Code of Conduct,
          unauthorised disclosure of confidential information, etc. It also
          includes any deliberate attempt to cover up any of the activities
          mentioned above.
        </Text>
        <Text className={classes.paragraph}>
          Those who become whistle blowers can choose to bring information or
          allegations to surface in writing to a supervisor, human resources,
          compliance or a neutral third party within the company, with the
          thought that the company will address and correct the issues.
        </Text>
        <Text className={classes.paragraph}>
          Information’s received shall be kept confidential and investigated in
          depth to root out the concerns with remedial measures or disciplinary
          action taken appropriately. Where there may be grounds for a possible
          criminal offence, management will be informed and legal advice may be
          sought on whether the matter should be referred to the relevant
          authority for the appropriate action. The whistle-blower will be
          notified if reporting to external parties are made.
        </Text>
      </Container>
    </>
  );
}
