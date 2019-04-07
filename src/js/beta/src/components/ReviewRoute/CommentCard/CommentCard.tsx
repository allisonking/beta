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
  const truncatedComment = React.useMemo(
    () =>
      comment.text.length < 10
        ? comment.text
        : `${comment.text.substring(0, 7)}...`,
    [comment.text]
  );
  const [commentDisplay, setCommentDisplay] = React.useState(truncatedComment);

  React.useEffect(() => {
    // emphasize the highlight
    const highlight = comment.highlightRef.current;
    if (highlight) {
      const currentClass = highlight.className;
      if (active) {
        const newClass = `${currentClass} ${highlightStyles.active}`;
        highlight.setAttribute('class', newClass);
        setCommentDisplay(comment.text);
      } else {
        highlight.setAttribute('class', highlightStyles.highlight);
        setCommentDisplay(truncatedComment);
      }
    }
  }, [active]);

  const handleClick = () => {
    onClick(comment);
  };
  console.log(comment, active);
  return (
    <div className={`${styles.commentCard} p-2`} onClick={handleClick}>
      {commentDisplay}
    </div>
  );
};

export default CommentCard;
