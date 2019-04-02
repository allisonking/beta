import React from 'react';

import WriteBox from './WriteBox/WriteBox';
import { convertToRaw, ContentState } from 'draft-js';

interface CreateChapterVariables {
  projectId: number;
  title: string;
  chapterText: string;
}
const WriteRoute = () => {
  const handleSave = (title: String, state: ContentState) => {
    const rawContentState = convertToRaw(state);
    const rawContentString = JSON.stringify(rawContentState);
  };
  return (
    <div>
      <WriteBox />
    </div>
  );
};

export default WriteRoute;
