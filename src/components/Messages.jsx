import React, { Component } from 'react';
import axios from '../axiosInstance';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const apiUrl = import.meta.env.VITE_API_URL;

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            error: null
        };
        this.loadMessages = this.loadMessages.bind(this);
    }

    loadMessages() {
        // Fetch messages from your backend API
        axios(apiUrl + 'messages/')
            .then(response => {
                // Update state with fetched messages
                this.setState({ messages: response.data, error: null });
            })
            .catch(error => {
                this.setState({ error: error.message });
            });
    }

    componentDidMount() {
        this.loadMessages();
        this.interval = setInterval(this.loadMessages, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Convert to local time format
    }

    render() {
        const { messages, error } = this.state;
        const {groups} = authService.getCurrentUser();

        return (<>
            {!groups.includes('coordinator') ? (
                <li className="nav-item dropdown">
                    <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                        <i className="bi bi-chat-left-text"></i>
                        <span className="badge bg-success badge-number">{messages.length}</span>
                    </a>

                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                        <li className="dropdown-header">
                            {messages.length > 0 ? `You have ${messages.length} new messages` : 'No new messages'}
                            <Link to="/message"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>

                        {error && <li className="dropdown-item text-danger">{error}</li>}

                        {messages.map(message => (
                            <li key={message.id} className="message-item">
                                <a href="#">
                                    <div>
                                        <h4>{message.coordinator ? message.coordinator.username : 'Unknown'}</h4> {/* Use coordinator username if available */}
                                        <p className='fw-bold'>{message.content}</p>
                                        <p>{message.report_token ? (`For-Report: ${message.report_token}`): ('')}</p>
                                        <p>{this.formatTimestamp(message.created_at)}</p> {/* Assuming created_at is a timestamp */}
                                    </div>
                                </a>
                            </li>
                        ))}

                        <li><hr className="dropdown-divider" /></li>
                        <li className="dropdown-footer">
                            <Link to="/message">Show all messages</Link>
                        </li>
                    </ul>
                </li>
            ): (<></>)}
            </>
        );
    }

}

export default Messages;
