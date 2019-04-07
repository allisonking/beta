import React, { ReactNode } from 'react';
import { RenderAttributes } from 'slate-react';
import cx from 'classnames';

import styles from './HighlightComment.module.scss';
interface Props {
  children: ReactNode;
  attributes: RenderAttributes;
  emphasized: boolean;
}

export type HighlightRef = HTMLSpanElement;

const HighlightComment = ({ attributes, children, emphasized }: Props) => {
  console.log('emphasized?', emphasized);
  return (
    <span
      {...attributes}
      className={cx({
        [styles.highlight]: !emphasized,
        [styles.highlightEmphasized]: emphasized,
      })}
    >
      {children}
    </span>
  );
};

export default HighlightComment;
