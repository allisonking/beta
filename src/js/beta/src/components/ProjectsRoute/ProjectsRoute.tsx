import React from 'react';
import { Query } from 'react-apollo';
import { Projects } from '../../queries/types/Projects';
import projectQuery from '../../queries/projects';

class ProjectQuery extends Query<Projects> {}

const ProjectsRoute = () => {
  return (
    <ProjectQuery query={projectQuery}>
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
                return <div key={i}>{project.title} </div>;
              }
            })}
          </div>
        );
      }}
    </ProjectQuery>
  );
};

export default ProjectsRoute;
