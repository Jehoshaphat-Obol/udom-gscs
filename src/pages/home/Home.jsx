import { Component } from 'react'
import StudentDashboard from '../dashboards/StudentDashboard'
import CoordinatorDashboard from '../dashboards/CoordinatorDashboard'

export default class Home extends Component {
  render() {
    return (
      <>
        <CoordinatorDashboard />
        {/* <StudentDashboard /> */}
      </>
    )
  }
}
  