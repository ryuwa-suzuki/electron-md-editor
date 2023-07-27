import React, { useMemo } from "react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { marked } from "marked";
import "highlight.js/styles/base16/bright.css";
import SimpleMDE from "easymde";
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

const MarkdownEditor: React.FC = () => {
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
    'heading-bigger',
    'heading-smaller',
    'heading-1',
    'heading-2',
    'heading-3',
    'clean-block',
    'horizontal-rule',
    'preview',
    'side-by-side',
    'fullscreen',
  ];

  const value = localStorage.getItem(`smde_saved_value`) || "";

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

    const sanitizedHtml = DOMPurify.sanitize(marked(value, { renderer }));
    return sanitizedHtml;
  };

  const mdeOptions: SimpleMDE.Options = useMemo(() => {
    const delay = 1000;

    return {
      breaks: true,
      minHeight: '600px',
      autofocus: true,
      spellChecker: false,
      toolbar,
      previewRender,
      autosave: {
        enabled: true,
        uniqueId: "saved_value",
        delay,
      },
    };
  }, [previewRender]);

  return (
    <div>
      <SimpleMdeReact id="simple-mde" value={value} options={mdeOptions} />
    </div>
  );
};

export default MarkdownEditor;

