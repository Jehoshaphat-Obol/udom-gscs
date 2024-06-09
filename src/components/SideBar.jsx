import { Component } from 'react'
import { NavLink } from 'react-router-dom'
import authService from '../services/authService'

export default class SideBar extends Component {
    render() {
        const currentUser = authService.getCurrentUser();
        return (
            <>
                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/">
                            <i className="bi bi-display"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/seats/">
                            <i className="bi bi-grid-3x3-gap"></i>
                            <span>Seats</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/timetable/">
                            <i className="bi bi-table"></i>
                            <span>Timetable</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/report/">
                            <i className="bi bi-card-text"></i>
                            <span>Report</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/notification/">
                            <i className="bi bi-bell"></i>
                            <span>Notifications</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={(navData) => (navData.isActive ? "nav-link" : "nav-link collapsed")} to="/message/">
                            <i className="bi bi-chat-left-text"></i>
                            <span>Messages</span>
                        </NavLink>
                    </li>
                </ul>
            </>
        )
    }
}
