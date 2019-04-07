import React from 'react';
import CommentCard from '../CommentCard/CommentCard';
import { Comment } from '../../../../types/comment';
import { RangeType } from 'slate';

interface Props {
  comments: Comment[];
  emphasizeHighlight: (highlightRange: RangeType) => void;
  deemphasizeHighlight: (highlightRange: RangeType) => void;
}

const CommentsContainer = ({
  comments,
  emphasizeHighlight,
  deemphasizeHighlight,
}: Props) => {
  const [activeComment, setActiveComment] = React.useState<Comment | null>(
    null
  );
  const handleClick = (comment: Comment) => {
    if (activeComment === comment) {
      setActiveComment(null);
    } else {
      setActiveComment(comment);
    }
  };
  return (
    <div>
      {comments.map((comment, i) => {
        return (
          <CommentCard
            key={i}
            comment={comment}
            onClick={handleClick}
            active={comment === activeComment}
            emphasizeHighlight={emphasizeHighlight}
            deemphasizeHighlight={deemphasizeHighlight}
          />
        );
      })}
    </div>
  );
};

export default CommentsContainer;
