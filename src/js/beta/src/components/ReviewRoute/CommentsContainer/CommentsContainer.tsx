import React from 'react';
import CommentCard from '../CommentCard/CommentCard';
import { Comment } from '../../../../types/comment';
import { RangeType } from 'slate';
import { groupBy, Dictionary } from 'lodash';

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
  const [groupedComments, setGroupedComments] = React.useState<
    Dictionary<Comment[]>
  >();

  React.useEffect(() => {
    const grouped = groupBy(comments, comment => {
      // group by the bounding box top element since we'll use that later
      // could also group by `data-key` which is guaranteed by slate to be unique
      // comment.domNode.getAttribute('data-key')
      return comment.domTop;
    });
    setGroupedComments(grouped);
  }, [comments]);

  const handleClick = (comment: Comment) => {
    if (activeComment === comment) {
      setActiveComment(null);
    } else {
      setActiveComment(comment);
    }
  };

  if (!groupedComments) {
    return null;
  }

  return (
    <div>
      {Object.keys(groupedComments as {}).map(top => {
        if (groupedComments) {
          const style = { top: `${top}px` };
          return (
            <div style={style} className="position-absolute w-75" key={top}>
              {groupedComments[top].map((comment, i) => {
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
        }
      })}
    </div>
  );
};

export default CommentsContainer;
