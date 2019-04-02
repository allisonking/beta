import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertToRaw,
} from 'draft-js';

import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import { Mutation } from 'react-apollo';
import createChapterMutation from '../../../mutations/chapter';
import { CreateChapterMutation } from '../../../mutations/MutationClasses';

import styles from './WriteBox.module.scss';

// interface Props {
//   onSave: (title: String, state: ContentState) => void;
// }

const WriteBox = () => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const [title, setTitle] = React.useState();

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

  const handleChangeTitle = (evt: React.SyntheticEvent<HTMLInputElement>) =>
    setTitle(evt.currentTarget.value);

  return (
    <div>
      <div className="text-right m-1">
        <CreateChapterMutation
          mutation={createChapterMutation}
          variables={{
            projectId: 1,
            title: title,
            chapterText: JSON.stringify(
              convertToRaw(editorState.getCurrentContent())
            ),
          }}
        >
          {(saveChapter, { data }) => (
            <button
              className="btn btn-primary"
              onClick={() => {
                saveChapter();
                if (data) {
                  console.log(data.ok);
                }
              }}
            >
              {' '}
              Save{' '}
            </button>
          )}
        </CreateChapterMutation>
      </div>
      <div className="text-left mx-2 p-2">
        <Label>Title</Label>
        <Input onChange={handleChangeTitle} />
      </div>

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
        <Label>Text</Label>
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
