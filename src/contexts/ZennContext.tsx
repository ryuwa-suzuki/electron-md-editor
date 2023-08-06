import { createContext, useContext, useState, useEffect } from 'react';
import { zennType } from '../types/zennTypes';

const ZennContentContext = createContext<zennType | undefined>(undefined);

export const useZennContentContext = () => {
  return useContext(ZennContentContext);
}

export const ZennContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileNames, setFileNames] = useState({ articles: [], books: [] });
  const [isZennSynced, setIsZennSynced] = useState<zennType['isZennSynced']>(localStorage.getItem('zenn_dir_path') ? true : false);
  const [zennData, setZennData] = useState<zennType['zennData']>({
    content: '',
    label: '',
    file: '',
  });
  const [selectedFile, setSelectedFile] = useState<zennType['selectedFile']>({
    label: localStorage.getItem('selected_label') || '',
    file: localStorage.getItem('selected_file') || '',
  });

  const [zennDirPath, setZennDirPath] = useState<zennType['zennDirPath']>(localStorage.getItem('zenn_dir_path') || '');

  const syncWithZenn = async () => {
    if (!zennDirPath) {
      setIsZennSynced(false);
      return;
    }

    try {
      const files = await window.api.syncWithZenn(zennDirPath);
      setIsZennSynced(true);
      setFileNames(files);
    } catch (error) {
      alert('エラーが発生しました')
      setIsZennSynced(false);
    }
  };

  const getZennContent = async () => {
    try {
      const content = await window.api.getZennContent(zennDirPath, selectedFile.label, selectedFile.file);

      setZennData({
        content,
        label: selectedFile.label,
        file: selectedFile.file
      });
      localStorage.setItem('smde_saved_value', content);
    } catch (error) {
      alert('エラーが発生しました');
    }
  };

  useEffect(() => {
    syncWithZenn();
    if(selectedFile.label === '' || selectedFile.file === '' || !isZennSynced) return;

    getZennContent();
  }, [selectedFile]);

  return (
    <ZennContentContext.Provider value={{
      zennData,
      fileNames,
      isZennSynced,
      zennDirPath,
      selectedFile,
      setZennData,
      setZennDirPath,
      setSelectedFile,
      syncWithZenn,
      getZennContent,
      setIsZennSynced
      }}>
      {children}
    </ZennContentContext.Provider>
  );
}
