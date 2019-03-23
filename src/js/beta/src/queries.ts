import { Query } from 'react-apollo';

interface Data {
  allProjects: [{ title: string }];
}

interface Variables {
  first: number;
}

export class AllProjectsQuery extends Query<Data, Variables> {}
