import React from 'react';
import { Editor } from 'slate-react';
import { Value, ValueJSON, Editor as CoreEditor } from 'slate';
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
  const emptyValue = React.useMemo(() => {
    return {
      document: {
        nodes: [
          {
            object: 'block',
            type: 'line',
            nodes: [{ object: 'text', leaves: [{ text: '' }] }],
          },
        ],
      },
    } as ValueJSON;
  }, []);
  const [editorValue, setEditorValue] = React.useState(
    Value.fromJSON(emptyValue)
  );

  const [title, setTitle] = React.useState();

  const editorRef = React.useCallback(node => {
    // focus the editor
    if (node !== null) {
      node.focus();
    }
  }, []);

  interface Change {
    value: Value;
  }
  const onChange = ({ value }: Change) => {
    setEditorValue(value);
  };

  // const onKeyDown = (event: any, editor: CoreEditor, next: () => any) => {
  //   console.log(event.key);
  //   return next();
  // };

  const handleChangeTitle = (evt: React.SyntheticEvent<HTMLInputElement>) =>
    setTitle(evt.currentTarget.value);
  console.log(editorValue);
  return (
    <div>
      <div className="text-right m-1">
        <CreateChapterMutation
          mutation={createChapterMutation}
          variables={{
            projectId: 1,
            title: title,
            chapterText: JSON.stringify(editorValue.toJSON()),
          }}
        >
          {(saveChapter, { loading, data, error }) => (
            <div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  saveChapter();
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </CreateChapterMutation>
      </div>
      <div className="text-left mx-2 p-2">
        <Label>Title</Label>
        <Input onChange={handleChangeTitle} />
      </div>

      <div className={`${styles.editor} mt-2 mx-2 p-2 text-left`}>
        <Label>Text</Label>
        <Editor
          ref={editorRef}
          value={editorValue}
          onChange={onChange}
          // onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

export default WriteBox;
