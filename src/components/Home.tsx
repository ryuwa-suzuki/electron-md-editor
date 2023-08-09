import MarkdownEditor from '../components/editor/MarkdownEditor';
import NavbarNested from '../components/navigation/Navbar';
import { useZennContentContext } from '../contexts/ZennContext';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import InitModal from '../components/modal/InitModal';

const Home = () => {
  const { zennDirPath, isZennSynced } = useZennContentContext();
  const ModalOpen = !zennDirPath;
  const [opened, { close }] = useDisclosure(ModalOpen);
  const editorWidth = isZennSynced ? {width: '75%'} : {width: '100%'}

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <InitModal closeModal={close} />
      </Modal>
      <div style={{display: 'flex'}}>
        {isZennSynced &&
        <div style={{width: '25%'}}>
          <NavbarNested/>
        </div>
        }
        <div style={editorWidth}>
          <MarkdownEditor/>
        </div>
      </div>
    </>
  )
}

export default Home;
