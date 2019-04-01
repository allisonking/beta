import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import styles from './WriteBox.module.scss';

const WriteBox = () => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const editorRef = React.useCallback(node => {
    // focus the editor
    if (node !== null) {
      node.focus();
    }
  }, []);

  React.useEffect(() => {
    EditorState.moveFocusToEnd(editorState);
  }, []);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const handleItalicize = () => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const handleBold = () => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const handleUnderline = () => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  return (
    <div>
      <button onClick={handleBold}>
        <strong>B</strong>
      </button>
      <button onClick={handleItalicize}>
        <em>I</em>
      </button>
      <button onClick={handleUnderline}>
        <u>U</u>
      </button>

      <div className={`${styles.editor} mt-2 mx-2 p-2 text-left`}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};

export default WriteBox;
