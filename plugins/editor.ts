// Dependencies
import { Plugin } from '@nuxt/types';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

const Editor: Plugin = (_context, inject) => {
  const defaultOptions = {
    id: '',
    data: {
      blocks: []
    },
    onChange: (_data: any, _event: any) => {},
    onReady: () => {}
  };

  const editor = (options = defaultOptions) => {
    return new EditorJS({
      placeholder: 'You look great today! Have fun editing. :)',
      holder: options.id,
      tools: {
        header: Header
      },
      data: options.data || { blocks: [] },
      onChange(data, event) {
        if (options.onChange) {
          options.onChange(data, event);
        }
      },
      onReady() {
        if (options.onReady) {
          options.onReady();
        }
      }
    })
  };

  inject('editor', (options: any) => editor(options));
};

export default Editor;
