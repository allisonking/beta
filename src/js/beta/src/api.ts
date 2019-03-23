import gql from 'graphql-tag';

export const QUERY_ALL_PROJECTS = gql`
  query {
    allProjects {
      title
    }
  }
`;
