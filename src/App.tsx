import MarkdownEditor from './components/MarkdownEditor';
import NavbarNested from './components/Navbar';
import { createContext, useContext, useState, useEffect } from 'react';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import InitModal  from './components/InitModal';

type zennContentType = {
  zennData: {
    content: string;
    label: string;
    file: string;
  },
  isZennSynced: boolean;
  setZennData: (zennData: {content: string, label: string, file: string}) => void;
  fetchData: () => Promise<void>;
};

const ZennContentContext = createContext<zennContentType | undefined>(undefined);

export const useZennContentContext = () => {
  return useContext(ZennContentContext);
}

export const App = () => {
  const [files, setFiles] = useState({articles: [], books: []});
  const [isZennSynced, setIsZennSynced] = useState<zennContentType["isZennSynced"]>(false);
  const [zennData, setZennData] = useState<zennContentType["zennData"]>({
    content: "",
    label: "",
    file: "",
  });

  const [zennDirPath, setZennDirPath] = useState(localStorage.getItem('zenn_dir_path'));
  const ModalOpen = zennDirPath !== null ? false : true;
  const [opened, { close }] = useDisclosure(ModalOpen);

  const fetchData = async () => {
    const path = localStorage.getItem('zenn_dir_path');
    setZennDirPath(path);
    if (!path) {
      setIsZennSynced(false);
      return;
    }

    try {
      const files = await window.api.syncWithZenn(path);
      setFiles(files);
      setIsZennSynced(true);
    } catch (error) {
      alert('エラーが発生しました')
      setIsZennSynced(false);
    }
  };

  useEffect(() => {
    if(!zennDirPath) return;
    fetchData();
  }, [zennDirPath]);

  const editorWidth = isZennSynced ? {width: '75%'} : {width: '100%'}

  return (
    <ZennContentContext.Provider value={{zennData, isZennSynced, setZennData, fetchData}}>
      <Modal opened={opened} onClose={close}>
        <InitModal closeModal={close}/>
      </Modal>
      <div style={{display: 'flex'}}>
        {isZennSynced &&
        <div style={{width: '25%'}}>
          <NavbarNested files={files}/>
        </div>
        }
        <div style={editorWidth}>
          <MarkdownEditor/>
        </div>
      </div>
    </ZennContentContext.Provider>
  )
}
