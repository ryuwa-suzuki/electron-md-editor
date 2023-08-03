import { Navbar, ScrollArea, createStyles, rem } from '@mantine/core';
import {
  IconNotes,
  IconBook,
} from '@tabler/icons-react';
import { LinksGroup } from './LinksGroup';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useZennContentContext } from '../App';

type Article = string;

type File = string;

type Book = {
  bookName: string;
  files: Array<File>;
};

type Props = {
  files: {
    articles: Array<Article>,
    books: Array<Book>
  };
};

type selectedFile = {
  selected: {
    label: string;
    file: string;
  }
  setSelectedFile: (selected: {label: string, file: string}) => void;
};
const SelectedFileContext = createContext<selectedFile | undefined>(undefined);

export function useSelectedFileContext() {
  return useContext(SelectedFileContext);
}

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

const NavbarNested: React.FC<Props> = ({ files }) =>  {
  const {articles, books} = files;
  const { classes } = useStyles();

  const articleLinks = articles.map((article) => {
    return (
      {label: article}
    )
  })

  const booksMockData = books.map((book) => {
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
      initiallyOpened: false,
      links: articleLinks
    },
    ...booksMockData
  ]

  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  const [selected, setSelectedFile] = useState<selectedFile["selected"]>({
    label: localStorage.getItem('selected_label') || "",
    file: localStorage.getItem('selected_file') || "",
  });

  const { setZennData } = useZennContentContext();
  const zennDirPath = localStorage.getItem('zenn_dir_path');

  useEffect(() => {
    if(selected.label === '' || selected.file === '') return;
    const fetchData = async () => {
      try {
        const content = await window.api.getZennFile(zennDirPath, selected.label, selected.file);

        setZennData({
          content,
          label: selected.label,
          file: selected.file
        });
        localStorage.setItem('smde_saved_value', content);
      } catch (error) {
        alert('エラーが発生しました');
      }
    };

    fetchData();
  }, []);

  return (
    <SelectedFileContext.Provider value={{selected, setSelectedFile}}>
      <Navbar height={800} p="md" className={classes.navbar}>
        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>{links}</div>
        </Navbar.Section>
      </Navbar>
    </SelectedFileContext.Provider>
  );
}

export default NavbarNested;
