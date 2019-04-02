import { gql } from 'apollo-boost';

export default gql`
  mutation($title: String!, $userId: Int!) {
    createProject(title: $title, userId: $userId) {
      ok
    }
  }
`;
