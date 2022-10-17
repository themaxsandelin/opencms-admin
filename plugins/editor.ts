// Dependencies
import { Plugin } from '@nuxt/types';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';

// Temporarily add this enum here to fix EditorJS config since LogLevels cannot be imported.
enum LogLevels {
  VERBOSE = 'VERBOSE',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

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
        header: Header,
        table: Table
      },
      logLevel: LogLevels.ERROR,
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
