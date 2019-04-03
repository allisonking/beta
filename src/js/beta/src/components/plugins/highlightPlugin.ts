/**
 * Adapted from https://medium.com/@siobhanpmahoney/building-a-rich-text-editor-with-draft-js-d26c2ca0083f
 */

import { RichUtils, EditorState } from 'draft-js';

export default () => {
  return {
    customStyleMap: {
      HIGHLIGHT: {
        background: '#fffe0d',
      },
    },
    keyBindingFn: (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'h') {
        return 'highlight';
      }
    },
    handleKeyCommand: (
      command: string,
      editorState: EditorState,
      { setEditorState }: any
    ) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
        return true;
      }
    },
  };
};
