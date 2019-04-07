import React from 'react';
import styles from './CommentCard.module.scss';
import highlightStyles from '../HighlightComment/HighlightComment.module.scss';
import { Comment } from '../../../../types/comment';

interface Props {
  comment: Comment;
  active: boolean;
  onClick: (comment: Comment) => void;
}

const CommentCard = ({ comment, onClick, active }: Props) => {
  React.useEffect(() => {
    const highlight = document.getElementById(comment.highlightId);
    if (highlight) {
      const currentClass = highlight.className;
      if (active) {
        const newClass = `${currentClass} ${highlightStyles.active}`;
        highlight.setAttribute('class', newClass);
      } else {
        highlight.setAttribute('class', highlightStyles.highlight);
      }
    }
  }, [active]);
  const handleClick = () => {
    onClick(comment);
  };
  return (
    <div className={`${styles.commentCard} p-2`} onClick={handleClick}>
      {comment.text}
    </div>
  );
};

export default CommentCard;
