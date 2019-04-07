import React, { ReactNode } from 'react';
import { RenderAttributes } from 'slate-react';

import styles from './HighlightComment.module.scss';
interface Props {
  children: ReactNode;
  attributes: RenderAttributes;
}

const HighlightComment = ({ attributes, children }: Props) => {
  return (
    <span {...attributes} className={styles.highlight} id="highlight123">
      {children}
    </span>
  );
};

export default HighlightComment;
