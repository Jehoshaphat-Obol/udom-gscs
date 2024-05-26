import React, { Component } from 'react';
import StudentDashboard from '../dashboards/StudentDashboard';
import CoordinatorDashboard from '../dashboards/CoordinatorDashboard';
import GuestDashboard from '../dashboards/GuestDashboard';
import authService from '../../services/authService';

export default class Home extends Component {
  getDashboard() {
    const currentUser = authService.getCurrentUser();
    
    // Handle the case where currentUser might be null
    if (!currentUser || !currentUser.groups) {
      return <></>;
    }

    if (currentUser.groups.includes('coordinator')) {
      return <CoordinatorDashboard />;
    } else if (currentUser.groups.includes('student')) {
      return <StudentDashboard />;
    } else if (currentUser.groups.includes('guest')) {
      return <GuestDashboard />;
    } else {
      return <></>;
    }
  }

  render() {
    const Dashboard = this.getDashboard();
    return (
      <>
        {Dashboard}
      </>
    );
  }
}
