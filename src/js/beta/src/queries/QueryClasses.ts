import { Query } from 'react-apollo';

interface Data {
  allProjects: Array<{ title: string }>;
}

interface Variables {}

export class AllProjectsQuery extends Query<Data, Variables> {}
