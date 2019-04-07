import React from 'react';

export interface Comment {
  text: string;
  highlightRef: React.RefObject<HighlightRef>;
}

export type HighlightRef = HTMLSpanElement;
