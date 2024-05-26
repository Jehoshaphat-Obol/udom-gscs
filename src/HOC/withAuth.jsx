import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const withAuth = (Component) => {
  return (props) => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      return <Navigate to="/auth/" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
