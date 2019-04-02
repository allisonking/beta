import React from 'react';
import { EditorState, convertFromRaw, Editor } from 'draft-js';

const ReviewRoute = () => {
  const projectNum = 1;
  const chapterNum = 1;
  const dummyText =
    '{"blocks":[{"key":"ettfl","text":"here is the latest and greatest chapter","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
  // get the text of a chapter + render via Draft
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(dummyText)))
  );

  // highlight only

  const handleEditorChange = () => {
    console.log('editor changed');
  };

  return (
    <div>
      Thanks for reviewing!
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        //readOnly
      />
    </div>
  );
};

export default ReviewRoute;
