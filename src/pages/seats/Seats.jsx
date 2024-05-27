import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ChimwagaCoordinator from './ChimwagaCoordinator'
import ChimwagaStudent from './ChimwagaStudent'
import ChimwagaGuest from './ChimwagaGuest'
import authService from '../../services/authService'
export default class Seats extends Component {

  getSeatingPlan() {
    const currentUser = authService.getCurrentUser();
    
    // Handle the case where currentUser might be null
    if (!currentUser || !currentUser.groups) {
      return <></>;
    }

    if (currentUser.groups.includes('coordinator')) {
      return <ChimwagaCoordinator />;
    } else if (currentUser.groups.includes('student')) {
      return <ChimwagaStudent />;
    } else if (currentUser.groups.includes('guest')) {
      return <ChimwagaGuest />;
    } else {
      return <></>;
    }
  }
  render() {
    const SeatingPlan = this.getSeatingPlan()
    return (
      <>
        <div className="pagetitle">
          <h1>My Seat</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Seats</li>
            </ol>
          </nav>
        </div>
        {SeatingPlan}
      </>
    )
  }
}
