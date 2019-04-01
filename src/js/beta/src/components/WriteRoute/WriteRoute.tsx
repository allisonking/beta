import React from 'react';
import { Query } from 'react-apollo';

import TextBox from '../TextBox/TextBox';
import { Projects } from '../../queries/types/Projects';
import { QUERY_ALL_PROJECTS } from '../../api';

class ProjectQuery extends Query<Projects> {}

const WriteRoute = () => {
  return (
    <ProjectQuery query={QUERY_ALL_PROJECTS}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) {
          console.log(error);
          return <div>Error!</div>;
        }
        if (!data || !data.allProjects) {
          return <div>No projects yet!</div>;
        }
        return (
          <div>
            <h3>All Projects</h3>
            {data.allProjects.map((project, i) => {
              if (project) {
                return <TextBox key={i} text={project.title} />;
              }
            })}
          </div>
        );
      }}
    </ProjectQuery>
  );
};

export default WriteRoute;
