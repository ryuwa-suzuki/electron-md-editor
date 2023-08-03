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
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useZennContentContext } from '../App';
import { useSelectedFileContext } from './Navbar';

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

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string;}[];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const hasLinks = Array.isArray(links);

  // const selectedFile = localStorage.getItem('selected_file');
  // const selectedLabel = localStorage.getItem('selected_label');

  const { selected, setSelectedFile } = useSelectedFileContext();

  let isOpend = false;
  (hasLinks ? links : []).forEach((link) => {
    if (link.label === selected.file && label === selected.label) {
      isOpend = true;
    }
  })

  const [opened, setOpened] = useState(isOpend || initiallyOpened);
  const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;
  const { setZennData } = useZennContentContext();
  const zennDirPath = localStorage.getItem('zenn_dir_path');

  const selectFile = async (label: string, file: string) => {
    try {
      const content = await window.api.getZennFile(zennDirPath, label, file);
      setZennData({
        content,
        label,
        file
      })
      localStorage.setItem('smde_saved_value', content);
    } catch {
      alert('エラーが発生しました')
    }
    localStorage.setItem('selected_file', file)
    localStorage.setItem('selected_label', label)
    setSelectedFile({label, file});
  }

  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component="a"
      className={`${classes.link} ${(link.label === selected.file && label === selected.label) ? classes.selectedLink : ''}`}
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
