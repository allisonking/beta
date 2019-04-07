import { Mutation } from 'react-apollo';

interface Chapter {
  title?: string;
  chapterText: string;
}

interface Data {
  ok: boolean;
  chapter: Chapter;
}

interface Variables {
  projectId: number;
  title?: string;
  chapterText: string;
}

export class CreateChapterMutation extends Mutation<Data, Variables> {}
