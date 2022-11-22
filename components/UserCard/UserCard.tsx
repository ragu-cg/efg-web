import { Avatar, Text, Button, Paper } from '@mantine/core';

interface UserCardProps {
  avatar: string;
  name: string;
  email: string;
  job: string;
}

export function UserCard({ avatar, name, email, job }: UserCardProps) {
  return (
    <Paper
      radius="md"
      withBorder
      p="lg"
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      })}
    >
      <Avatar src={avatar} size={120} radius={120} mx="auto" />
      <Text align="center" size="lg" weight={500} mt="md">
        {name}
      </Text>
      <Text align="center" color="dimmed" weight={500} size="sm">
        {job}
      </Text>

      <Text align="center" color="dimmed" size="sm">
        {email}
      </Text>
    </Paper>
  );
}