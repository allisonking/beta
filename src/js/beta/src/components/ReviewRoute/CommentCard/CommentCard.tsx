import React, { CSSProperties } from 'react';
import styles from './CommentCard.module.scss';
import { Comment } from '../../../../types/comment';
import { RangeType } from 'slate';

interface Props {
  comment: Comment;
  active: boolean;
  style?: CSSProperties;
  className?: string;
  onClick: (comment: Comment) => void;
  emphasizeHighlight: (highlightRange: RangeType) => void;
  deemphasizeHighlight: (highlightRange: RangeType) => void;
}

const CommentCard = ({
  comment,
  onClick,
  active,
  className,
  emphasizeHighlight,
  deemphasizeHighlight,
  style,
}: Props) => {
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
    if (active) {
      emphasizeHighlight(comment.highlightRange);
      setCommentDisplay(comment.text);
    } else {
      deemphasizeHighlight(comment.highlightRange);
      setCommentDisplay(truncatedComment);
    }
  }, [active]);

  const handleClick = () => {
    onClick(comment);
  };

  return (
    <div
      className={`${styles.commentCard} p-2 ${className}`}
      onClick={handleClick}
      style={style}
    >
      {commentDisplay}
    </div>
  );
};

export default CommentCard;
