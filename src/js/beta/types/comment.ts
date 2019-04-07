import React from 'react';
import { Range, RangeType } from 'slate';

export interface Comment {
  text: string;
  highlightRange: RangeType;
}

//export type HighlightRef = HTMLSpanElement;
