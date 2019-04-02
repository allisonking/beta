import React from 'react';
import projectQuery from '../../queries/projects';
import { AllProjectsQuery } from '../../queries/QueryClasses';

const ProjectsRoute = () => {
  return (
    <AllProjectsQuery query={projectQuery}>
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
    </AllProjectsQuery>
  );
};

export default ProjectsRoute;
