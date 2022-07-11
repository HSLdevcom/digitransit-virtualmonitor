import React, { FC, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from './App';

interface IProps {
  component: any;
  path: string;
}
const ProtectedRoute : FC<IProps> = ({component: Component, ...props}) => {
  const user = useContext(UserContext);

  return (
    <Route 
      {...props} 
      render={props => (
        user?.sub ?
          <Component {...props} /> :
          <Redirect to='/' />
      )} 
    />
  )
}

export default ProtectedRoute;
