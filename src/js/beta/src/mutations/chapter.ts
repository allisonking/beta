import { gql } from 'apollo-boost';

export default gql`
  mutation($projectId: Int!, $title: String!, $chapterText: String!) {
    createChapter(
      projectId: $projectId
      title: $title
      chapterText: $chapterText
    ) {
      ok
      chapter {
        title
        chapterText
      }
    }
  }
`;
