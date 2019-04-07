import React, { ReactNode } from 'react';
import { RenderAttributes } from 'slate-react';

import styles from './HighlightComment.module.scss';
interface Props {
  children: ReactNode;
  attributes: RenderAttributes;
}

export type HighlightRef = HTMLSpanElement;

const HighlightComment = React.forwardRef<HighlightRef, Props>((props, ref) => {
  const { attributes, children } = props;
  return (
    <span {...attributes} className={styles.highlight} ref={ref}>
      {children}
    </span>
  );
});

export default HighlightComment;
