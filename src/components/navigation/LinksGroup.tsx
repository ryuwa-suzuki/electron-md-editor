import { useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import { TablerIconsProps, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useZennContentContext } from '../../contexts/ZennContext';

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      cursor: 'pointer'
    },
  },
  selectedLink: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    cursor: 'pointer',
  },
  resetLink: {
    backgroundColor: 'transparent',
    color: theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[7],
    cursor: 'pointer',
  },
  chevron: {
    transition: 'transform 200ms ease',
  },
}));

type LinksGroupProps = {
  icon: React.FC<TablerIconsProps>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string;}[];
};

const LinksGroup: React.FC<LinksGroupProps> = ({ icon: Icon, initiallyOpened, label, links }) => {
  const { classes, theme } = useStyles();
  const { selectedFile, setSelectedFile } = useZennContentContext();
  const hasLinks = Array.isArray(links);

  let isOpend = false;
  (hasLinks ? links : []).forEach((link) => {
    if (link.label === selectedFile.file && label === selectedFile.label) {
      isOpend = true;
    }
  })

  const [opened, setOpened] = useState(isOpend || initiallyOpened);

  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  const selectFile = (label: string, file: string) => {
    setSelectedFile({label, file});
    localStorage.setItem('selected_file', file)
    localStorage.setItem('selected_label', label)
  }

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      className={`${classes.link} ${(link.label === selectedFile.file && label === selectedFile.label) ? classes.selectedLink : ''}`}
      key={link.label}
      onClick={() => {
        selectFile(label, link.label)
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

export default LinksGroup;
