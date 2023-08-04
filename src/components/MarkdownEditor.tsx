import React, { useMemo } from "react";
import SimpleMdeReact from "react-simplemde-editor";
import SimpleMDE from "easymde";
import { marked } from "marked";
import hljs from 'highlight.js';
import "easymde/dist/easymde.min.css";
import "highlight.js/styles/base16/bright.css";
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useZennContentContext } from '../App';
import InitModal from '../components/InitModal';

const MarkdownEditor = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const modalOpen = () => {
    open();
  }
  const toolbar: SimpleMDE.Options["toolbar"] = [
    'bold',
    'italic',
    'quote',
    'unordered-list',
    'ordered-list',
    'link',
    'image',
    'strikethrough',
    'code',
    'table',
    'redo',
    'heading',
    'undo',
    'clean-block',
    'horizontal-rule',
    'preview',
    'side-by-side',
    'fullscreen',
    '|',
    {
      name: "settings",
      action: modalOpen,
      className: "fa fa-cog",
      title: "settings"
    },
    {
      name: "image",
      action: () => {
        const input = document.getElementById("imageFileInput");
        if (input) {
          input.click();
          input.onchange = async () => {
            const imgFile = (input as HTMLInputElement).files?.[0];
            if (imgFile) {
              imageUploadFunction(imgFile)
            }
          };
        }
      },
      className: "fa fa-upload",
      title: "Image Upload",
    },
  ];

  const { zennData, setZennData } = useZennContentContext();
  const isZennSynced = zennData.label !== '' && zennData.file !== ''
  const value = localStorage.getItem('smde_saved_value') || "";

  marked.setOptions({breaks : true});

  const previewRender = (value: string): string => {
    const renderer = new marked.Renderer();
    renderer.code = (code, codeInfo) => {
      const codeInfoSplit = codeInfo.split(':');
      const lang = codeInfoSplit[0]
      const fileName = codeInfoSplit[1];
      const langClass = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlightedCode = hljs.highlight(langClass, code).value;
      const codeBlockClass = fileName === undefined ? 'code-block-no-info' : 'code-block';

      let codeBlock = `<code class="hljs ${codeBlockClass} language-${langClass}">${highlightedCode}</code>`
      if (fileName !== undefined) {
        codeBlock = `<div class="code-info"><span>${fileName}</span></div>` + codeBlock
      }
      return `<pre>${codeBlock}</pre>`
    };

    renderer.image = (href, title, text) => {
      let newHref = href;
      if (!newHref.startsWith('http://') && !newHref.startsWith('https://')) {
        newHref = `file://${zennDirPath}${newHref}`;
      }
      return `<img style="margin: 1.5rem auto;display: table;max-width: 100%; height: auto;" src="${newHref}" alt="${text}" title="${title || text}">`;
    };

    return marked(value, { renderer });
  };

  const imageUploadFunction = async (image:File) => {
    if (!isZennSynced) {
      alert('アップロードできません');
      return;
    }

    const imageName = await window.api.uploadImage(zennDirPath, image.path);

    const newContent = localStorage.getItem('smde_saved_value') + '![](/images/'+ imageName +')';

    setZennData({...zennData, content: newContent});
    saveFile(newContent)
  }

  const mdeOptions: SimpleMDE.Options = useMemo(() => {
    const delay = 1000;

    return {
      breaks: true,
      width: 'auto',
      autofocus: true,
      spellChecker: false,
      toolbar,
      uploadImage: true,
      previewRender,
      imageUploadFunction,
      autosave: {
        enabled: true,
        uniqueId: "saved_value",
        delay,
      },
    };
  }, [previewRender]);

  let saveTimeout: NodeJS.Timeout | undefined;
  const zennDirPath = localStorage.getItem('zenn_dir_path');
  const saveFile = async (newContent: string) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    if (newContent !== zennData.content) {
      saveTimeout = setTimeout(async () => {
        try {
          await window.api.saveZennFile(zennDirPath, zennData.label, zennData.file, newContent);
        } catch (error) {
          alert('エラーが発生しました');
        }
      }, 2000);
    }
  }

  return (
    <>
      <input type="file" id="imageFileInput" style={{ display: "none" }} />
      <Modal opened={opened} onClose={close}>
        <InitModal closeModal={close}/>
      </Modal>
      <SimpleMdeReact
        id="simple-mde"
        onChange={isZennSynced ? saveFile : null}
        value={isZennSynced ? zennData.content : value}
        options={mdeOptions} />
    </>
  );
};

export default MarkdownEditor;

