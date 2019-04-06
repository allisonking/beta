import React from 'react';
import { FormGroup, Input, Button } from 'reactstrap';

interface Props {
  onSave: (text: string) => void;
  onCancel: () => void;
}

const Comment = ({ onSave, onCancel }: Props) => {
  const [commentText, setCommentText] = React.useState('');
  const handleCommentTextChange = (
    evt: React.SyntheticEvent<HTMLInputElement>
  ) => {
    setCommentText(evt.currentTarget.value);
  };

  const handleSave = () => {
    onSave(commentText);
  };

  return (
    <div>
      <FormGroup>
        <Input
          autoFocus
          type="textarea"
          value={commentText}
          onChange={handleCommentTextChange}
        />
      </FormGroup>
      <div className="d-flex justify-content-around">
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default Comment;
