import { Input, Button, Group, Space } from '@mantine/core';
// import { useState } from 'react';
import { useZennContentContext } from '../../contexts/ZennContext';

interface InitModalProps {
  closeModal: () => void;
}

const InitModal: React.FC<InitModalProps> = ({closeModal}) => {
  const { zennDirPath, syncWithZenn, setZennDirPath, setIsZennSynced } = useZennContentContext();
  const sync = async () => {
    localStorage.setItem('zenn_dir_path', zennDirPath);
    setZennDirPath(zennDirPath);
    syncWithZenn();
    closeModal();
  }
  const  notSync = () => {
    localStorage.setItem('zenn_dir_path', '');
    setZennDirPath('');
    setIsZennSynced(false);
    closeModal();
  }
  return (
    <>
      <Input.Wrapper
        id="input-demo"
        label="Zennのルートパスを入力"
      >
        <Input
          placeholder="/Users/zenn"
          value={zennDirPath}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setZennDirPath(event.target.value)}
        />
      </Input.Wrapper>
      <Space h="xl" />
      <Group position="center" spacing="xl">
        <Button onClick={sync}>
          Zennと同期する
        </Button>
        <Button onClick={notSync} variant="outline">
          同期しないで始める
        </Button>
      </Group>
    </>
  )
}

export default InitModal;
