import { Navbar, ScrollArea, createStyles } from '@mantine/core';
import { IconNotes, IconBook } from '@tabler/icons-react';
import LinksGroup from './LinksGroup';
import { useZennContentContext } from '../../contexts/ZennContext';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}));

const NavbarNested: React.FC = () =>  {
  const { fileNames } = useZennContentContext();
  const { classes } = useStyles();

  const articleLinks = fileNames.articles.map((article) => {
    return (
      {label: article}
    )
  })

  const booksMockData = fileNames.books.map((book) => {
    const bookLinks = book.files.map((file) => {
      return ({label: file})
    })
    return (
      {
        label: book.bookName,
        icon: IconBook,
        initiallyOpened: false,
        links: bookLinks
      }
    )
  })
  const mockdata = [
    {
      label: 'articles',
      icon: IconNotes,
      initiallyOpened: true,
      links: articleLinks
    },
    ...booksMockData
  ]

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <Navbar height={800} p="md" className={classes.navbar}>
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  );
}

export default NavbarNested;
