import React from 'react';
import CommentCard from '../CommentCard/CommentCard';
import { Comment } from '../../../../types/comment';

interface Props {
  comments: Comment[];
}

const CommentsContainer = ({ comments }: Props) => {
  const [activeComment, setActiveComment] = React.useState<Comment | null>(
    null
  );
  const handleClick = (comment: Comment) => {
    setActiveComment(comment);
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
          />
        );
      })}
    </div>
  );
};

export default CommentsContainer;
