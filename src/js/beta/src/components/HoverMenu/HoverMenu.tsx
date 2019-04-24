/**
 * Adapted from https://github.com/ianstormtaylor/slate/blob/master/examples/hovering-menu/index.js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import styles from './HoverMenu.module.scss';

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  ref: MenuRef;
  className?: string;
}

export type MenuRef = HTMLDivElement;

const HoverMenu = React.forwardRef<MenuRef, Props>(
  ({ isOpen, className, children }: Props, ref) => {
    if (!isOpen) {
      return null;
    }
    const root = window.document.getElementById('root')!;
    return ReactDOM.createPortal(
      <div className={cx(className, styles.menu)} ref={ref}>
        {children}
      </div>,
      root
    );
  }
);

export default HoverMenu;
