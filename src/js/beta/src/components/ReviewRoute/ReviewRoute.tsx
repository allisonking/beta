import React from 'react';
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Editor from 'draft-js-plugins-editor';
import createHighlightPlugin from '../plugins/highlightPlugin';
import CommentForm from './CommentForm/CommentForm';

const ReviewRoute = () => {
  const projectNum = 1;
  const chapterNum = 1;
  const dummyText =
    '{"blocks":[{"key":"c71lh","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget ipsum sollicitudin, accumsan sapien eget, rhoncus enim. Etiam sed tellus eros. Ut eros ligula, feugiat ac lectus sit amet, vestibulum ultrices augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque at tincidunt est. Integer dictum est scelerisque, condimentum odio at, pretium diam. Donec ut ultrices justo, nec mollis leo. Duis pharetra massa lectus, non sodales tortor maximus sed. Aliquam ac sapien fermentum, volutpat ex in, egestas nunc. Ut et lectus justo. Donec viverra purus in metus hendrerit, vitae pellentesque massa laoreet.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9b7sr","text":"Ut venenatis tellus ut tellus porta, ac efficitur nunc laoreet. Morbi vitae varius sem, ornare rutrum ex. Maecenas tempor volutpat metus, tristique aliquam nulla porta vitae. Etiam lacus nunc, finibus quis eleifend vel, congue a orci. Donec fermentum velit nec augue ultricies ultrices. Praesent tristique quam non tristique hendrerit. Suspendisse potenti. Duis non dignissim diam. Sed a efficitur erat. In sollicitudin leo quis diam pharetra volutpat. Morbi pellentesque velit eget diam cursus placerat. Sed nulla mauris, dapibus vitae diam at, lacinia elementum massa. Etiam vel lacinia ligula. Sed erat lectus, dictum sit amet mauris et, placerat volutpat sem.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bsev4","text":"Fusce ultricies neque dui. Proin in vehicula dui, fermentum interdum libero. Suspendisse egestas diam ac ligula mollis accumsan. Fusce sed est ultricies, ultricies nisl quis, congue velit. Duis eu mi a leo vestibulum egestas. Phasellus faucibus sed lectus et euismod. Vivamus dictum libero sit amet facilisis egestas.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

  const highlightPlugin = createHighlightPlugin();

  // get the text of a chapter + render via Draft
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(convertFromRaw(JSON.parse(dummyText)))
  );

  const [commentButtonIsEnabled, setCommentButtonIsEnabled] = React.useState(
    false
  );
  const [showPopover, setShowPopover] = React.useState(false);

  const handleCommentButton = () => {
    console.log('comment button clicked');
    console.log('in comment button', editorState.getSelection());
    console.log(convertToRaw(editorState.getCurrentContent()));
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));

    setShowPopover(true);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const isSelection = (state: EditorState) => {
    const selection = state.getSelection();
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    console.log(start, end);
    return start !== end;
  };

  const handleEditorChange = (state: EditorState) => {
    console.log(state.getSelection());
    setEditorState(state);
    if (isSelection(state)) {
      setCommentButtonIsEnabled(true);
    } else {
      setCommentButtonIsEnabled(false);
    }
  };

  const handleCommentSave = (text: string) => {
    console.log('text', text);
    console.log('start', editorState.getSelection().getStartOffset());
    console.log('end', editorState.getSelection().getEndOffset());
    console.log('block', editorState.getSelection().getAnchorKey());
    // return things to the normal state
    setShowPopover(false);
    setCommentButtonIsEnabled(false);
  };

  const handleCommentCancel = () => {
    // remove the highlight
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
    //setEditorState(EditorState.undo(editorState));
    // return things to the normal state
    setShowPopover(false);
    setCommentButtonIsEnabled(false);
  };

  return (
    <div className="text-left p-2 m-2">
      <div>
        <button
          id="comment"
          onClick={handleCommentButton}
          disabled={!commentButtonIsEnabled}
        >
          Comment
        </button>
        <Popover
          placement={'top'}
          isOpen={showPopover}
          target={'comment'}
          toggle={togglePopover}
          hideArrow
        >
          <PopoverHeader>Add Comment</PopoverHeader>
          <PopoverBody>
            <CommentForm
              onSave={handleCommentSave}
              onCancel={handleCommentCancel}
            />
          </PopoverBody>
        </Popover>
      </div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        plugins={[highlightPlugin]}
        handleKeyCommand={handleKeyCommand}
        //readOnly
      />
    </div>
  );
};

export default ReviewRoute;
