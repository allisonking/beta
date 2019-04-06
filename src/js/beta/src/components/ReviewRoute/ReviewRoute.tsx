import React from 'react';
import { Editor, RenderMarkProps, RenderNodeProps } from 'slate-react';
import { Value, ValueJSON, Editor as CoreEditor, Selection } from 'slate';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import isHotkey from 'is-hotkey';
import CommentForm from './CommentForm/CommentForm';
import HighlightComment from './HighlightComment/HighlightComment';

const ReviewRoute = () => {
  const dummyText =
    '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a neque erat. Maecenas et nisl eget odio faucibus fermentum eget quis lectus. Phasellus et hendrerit lorem. Etiam vitae molestie justo. Sed non justo gravida, faucibus lectus nec, interdum risus. Cras vulputate eros nisi, nec imperdiet magna gravida vitae. Pellentesque iaculis pretium magna eget rutrum. Suspendisse efficitur quis magna vel molestie. Proin laoreet iaculis arcu, sit amet pellentesque nunc congue vitae. Duis aliquam nunc sed consectetur dictum. Fusce nec metus sagittis, mattis erat et, varius ante. Aliquam eget lacinia ante.","marks":[]}]}]},{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Morbi lorem quam, sagittis in leo quis, lobortis consequat mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec efficitur pulvinar neque et pellentesque. Nunc molestie ipsum ac lacinia aliquet. Vivamus feugiat tellus et condimentum aliquam. Quisque feugiat consectetur orci, non viverra nisi viverra vel. Proin non orci enim. Phasellus euismod porttitor aliquet. Vestibulum iaculis neque id eros iaculis, ac tempus diam maximus. Sed pellentesque erat eu massa consectetur, eu auctor felis ultricies. Quisque sagittis turpis nulla.","marks":[]}]}]},{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"","marks":[]}]}]},{"object":"block","type":"line","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Pellentesque volutpat, justo vel elementum volutpat, quam libero finibus felis, at feugiat arcu tellus vel nisl. Nulla sed lorem et mi eleifend tempus. Curabitur nec erat ac erat bibendum maximus. Sed ullamcorper turpis nunc, id faucibus erat tincidunt vitae. Vestibulum id viverra leo. Aenean quis ipsum faucibus, lacinia quam a, consequat arcu. Nunc et maximus nunc. Curabitur commodo pharetra neque, a finibus justo vehicula ut. Nullam id libero id orci vehicula imperdiet. Proin varius justo sit amet ipsum sodales, non congue nulla ultrices. Nullam tempor est eget venenatis iaculis. Suspendisse volutpat augue eu egestas interdum. Suspendisse blandit porta mauris posuere feugiat. Aliquam rhoncus neque mollis, gravida massa id, semper urna. Etiam lobortis magna sodales, fermentum urna vel, blandit tortor. Phasellus lobortis est eu erat laoreet varius.","marks":[]}]}]}]}}';

  // get the text of the chapter and render it
  const [editorValue, setEditorValue] = React.useState(
    Value.fromJSON(JSON.parse(dummyText) as ValueJSON)
  );

  // ref to the editor
  const editorRef = React.useRef<Editor | null>(null);
  const editorNodeRef = React.useRef<HTMLDivElement | null>(null);

  const [commentButtonIsEnabled, setCommentButtonIsEnabled] = React.useState(
    false
  );
  const [showPopover, setShowPopover] = React.useState(false);

  const handleCommentButton = () => {
    const editor = editorRef.current;
    if (editor) {
      editor.toggleMark('highlight');
    }
    //setShowPopover(true);
  };

  const openCommentBox = () => {
    setTimeout(() => {
      setShowPopover(true);
    }, 1);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const onKeyDown = (event: Event, editor: CoreEditor, next: () => any) => {
    event.preventDefault();

    if (isHotkey('mod+h', event as KeyboardEvent)) {
      editor.toggleMark('highlight');
      setTimeout(() => {
        setShowPopover(true);
      }, 1);
    }

    return next();
  };

  const renderMark = (
    props: RenderMarkProps,
    editor: CoreEditor,
    next: () => any
  ) => {
    switch (props.mark.type) {
      case 'highlight':
        return <HighlightComment {...props} />;
      default:
        return next();
    }
  };

  const isSelection = (selection: Selection) => {
    const start = selection.start.offset;
    const end = selection.end.offset;
    console.log(start, end);
    console.log(selection.isFocused);
    return start !== end;
  };

  interface Change {
    value: Value;
  }
  const onChange = ({ value }: Change) => {
    // TODO: if user clicks outside, disable the comment button
    // unless they clicked the comment button...
    setEditorValue(value);
    if (isSelection(value.selection)) {
      setCommentButtonIsEnabled(true);
    } else {
      setCommentButtonIsEnabled(false);
    }
  };

  const handleCommentSave = (text: string) => {
    console.log('text', text);
    console.log('start', editorValue.selection.start.offset);
    console.log('end', editorValue.selection.end.offset);
    console.log('block', editorValue.selection.anchor.key);
    // return things to the normal state
    setShowPopover(false);
    setCommentButtonIsEnabled(false);
  };

  const handleCommentCancel = () => {
    // remove the highlight
    const editor = editorRef.current;
    if (editor) {
      editor.undo();
    }
    // return things to the normal state
    setTimeout(() => {
      setShowPopover(false);
      setCommentButtonIsEnabled(false);
    }, 1);
  };

  return (
    <div className="row">
      <div className="text-left col-8">
        <div className="p-2">
          <Editor
            ref={editorRef}
            value={editorValue}
            onChange={onChange}
            readOnly={showPopover}
            onKeyDown={onKeyDown}
            renderMark={renderMark}
          />
        </div>
      </div>
      <div className="col-4">
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
      </div>
    </div>
  );
};
// try this out? https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/link/link.html
export default ReviewRoute;
