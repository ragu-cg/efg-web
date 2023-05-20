import {
  Title,
  Text,
  Container,
  Button,
  Overlay,
  createStyles,
  BackgroundImage,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 80,
    paddingBottom: 80,
    backgroundSize: "cover",
    backgroundPosition: "center",

    "@media (max-width: 520px)": {
      paddingTop: 40,
      paddingBottom: 40,
    },
  },

  title: {
    position: "relative",
    zIndex: 1,
    fontWeight: 800,
    fontSize: 40,
    maxWidth: "720px",
    margin: "0 auto",
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: "center",

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 1.5,
    display: "flex",
    justifyContent: "center",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    height: 42,
    fontSize: theme.fontSizes.md,

    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: "rgba(255, 255, 255, .4)",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, .45) !important",
    },
  },
}));

type BannerProps = {
  title: String;
  img?: String;
};

export function Banner({ title, img }: BannerProps) {
  const { classes, cx } = useStyles();

  img = img || "./images/default-bg.jpg";

  return (
    <div className={classes.wrapper} style={{ backgroundImage: `url(${img})` }}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />
      <Title className={classes.title}>
        <Text
          component="span"
          inherit
          className={classes.highlight}
          variant="gradient"
          gradient={{ from: "blue", to: "white" }}
        >
          {title}
        </Text>
      </Title>
    </div>
  );
}
