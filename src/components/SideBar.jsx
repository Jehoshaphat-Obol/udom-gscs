import { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class SideBar extends Component {
  render() {
    return (
      <>
            <ul className="sidebar-nav" id="sidebar-nav">

                <li className="nav-item">
                    <NavLink className={(navData)=> (navData.isActive ? "nav-link": "nav-link collapsed")} to="/">
                        <i className="bi bi-display"></i>
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/seats">
                        <i className="bi bi-grid-3x3-gap"></i>
                        <span>Seats</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/timetable">
                        <i className="bi bi-table"></i>
                        <span>Timetable</span>
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/report">
                        <i className="bi bi-card-text"></i>
                        <span>Report</span>
                    </NavLink>
                </li>
            </ul>
      </>
    )
  }
}
