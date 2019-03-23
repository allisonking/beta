import React from 'react';
import { Query } from 'react-apollo';
import { AllProjectsQuery } from '../../queries';
import TextBox from '../TextBox/TextBox';
import { QUERY_ALL_PROJECTS } from '../../api';

const WriteRoute = () => {
  //const text = 'hello hello hello';
  return (
    <Query query={QUERY_ALL_PROJECTS}>
      {({ loading, error, data }) => {
        console.log(error);
        return !loading && <TextBox text={data} />;
      }}
    </Query>
  );
};

export default WriteRoute;
