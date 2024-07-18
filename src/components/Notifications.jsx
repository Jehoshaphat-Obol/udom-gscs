import React, { Component } from 'react';
import axios from '../axiosInstance';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const apiUrl = import.meta.env.VITE_API_URL;


class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            error: null
        };
        this.loadNotification = this.loadNotification.bind(this);
    }

    loadNotification() {
        // Fetch notifications from your backend API
        axios(apiUrl + 'notifications/')  // Assuming the endpoint is '/api/notifications/'
            .then(response => {
                // Update state with fetched notifications
                this.setState({ notifications: response.data });
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    componentDidMount() {
        this.loadNotification();
        setInterval(this.loadNotification, 5000)
    }

    render() {
        const { notifications, error } = this.state;
        const {groups} = authService.getCurrentUser();
        return (
            <>
                {!groups.includes('coordinator') ? (
                    <div>
                        <li className="nav-item dropdown">
                            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                                <i className="bi bi-bell"></i>
                                <span className="badge bg-primary badge-number">{notifications.length}</span>
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                                <li className="dropdown-header">
                                    {notifications.length > 0 ? `You have ${notifications.length} new notifications` : 'No new notifications'}
                                    <Link to="/notification"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>

                                {error && <li>{error}</li>}

                                {notifications.map(notification => (
                                    <li key={notification.id} className="notification-item">
                                        <i className={`bi bi-info-circle-fill text-info`}></i>
                                        <div>
                                            <h4>{notification.title}</h4>
                                            <p>{notification.content}</p>
                                            <p>{notification.timestamp}</p>
                                        </div>
                                    </li>
                                ))}

                                <li><hr className="dropdown-divider" /></li>
                                <li className="dropdown-footer">
                                    <Link to="/notification">Show all notifications</Link>
                                </li>
                            </ul>
                        </li>
                    </div>
                ) : (<></>)}
            </>)

    }
}

export default Notifications;
