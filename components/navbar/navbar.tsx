import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";

const HEADER_HEIGHT = 80;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    [theme.fn.smallerThan("sm")]: {
      width: 48,
      height: 45,
    },
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",

      '&.m-menu-open': { // when hamburger menu is open.
        display: "block",
        position: "absolute",
        width: "100%",
        left: 0,
        top: "80px",
        zIndex: 10,
        background: "#ffffff",
  
        a: {
          padding: "20px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
        }
      }
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

interface HeaderActionProps {
  links: {
    link: string;
    label: string;
    links?: { link: string; label: string }[];
  }[];
}

export const HeaderAction = (props: HeaderActionProps) => {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false, {
    onOpen: () => { document.body.classList.add('no-scroll')},
    onClose: () => { document.body.classList.remove('no-scroll')},
  });
  // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // const dark = colorScheme === "dark";
  const items = props.links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item component="a" href={item.link} key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" exitTransitionDuration={0}>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a
        key={link.label}
        href={link.link}
        className={classes.link}
      >
        {link.label}
      </a>
    );
  });

  return (
    <Header
      height={HEADER_HEIGHT}
      sx={{ borderBottom: 0 }}
      style={{ boxShadow: "0 2px 13px 0 rgba(0, 0, 0, 0.25)" }}
    >
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="md"
          />
          <Link href="/"><Image className={classes.logo}
            src={"/images/efg-logo.png"}
            width={64}
            height={60}
            alt="EFG Logo"
          /></Link>
         
        </Group>
        <Group spacing={5} className={`${classes.links} ${opened ? 'm-menu-open' : ''}`}>
          {items}
        </Group>
        <Group>
          <Button component="a" href="/contact" radius="xl" sx={{ height: 40 }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            Book now!
          </Button>
          <ColorSchemeToggle />
        </Group>
      </Container>
    </Header>
  );
};
