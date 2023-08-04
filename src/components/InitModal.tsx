import { Input, Button, Group, Space } from '@mantine/core';
import { useState } from 'react';
import { useZennContentContext } from '../App';

interface InitModalProps {
  closeModal: () => void;
}

const InitModal: React.FC<InitModalProps> = ({closeModal}) => {
  const [zennDirPath, setZennDirPath] = useState(localStorage.getItem('zenn_dir_path') || '');
  const { fetchData } = useZennContentContext();
  const sync = () => {
    localStorage.setItem('zenn_dir_path', zennDirPath);
    fetchData();
    closeModal();
  }
  const  notSync = () => {
    localStorage.setItem('zenn_dir_path', '');
    fetchData();
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
