import React from 'react';
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  ContentBlock,
} from 'draft-js';

const Media = (props: EditorState) => {};

export const commentRenderer = (block: ContentBlock) => {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
      props: {
        foo: 'bar',
      },
    };
  }
};
