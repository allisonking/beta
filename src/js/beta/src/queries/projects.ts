import { gql } from 'apollo-boost';

export default gql`
  query Projects {
    allProjects {
      title
    }
  }
`;
