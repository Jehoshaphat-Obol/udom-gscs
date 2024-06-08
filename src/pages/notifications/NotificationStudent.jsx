import React, { Component } from 'react';
import Select from 'react-select';
import axios from '../../axiosInstance';
import authService from '../../services/authService';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
import DataTable from 'react-data-table-component';

export default class NotificationStudent extends Component {
    state = {
        notifications: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchNotifications();
        axios.get(`${apiUrl}users/`)
            .then(response => {
                const users = response.data.map(user => ({
                    value: user.id,
                    label: `${user.first_name} ${user.last_name} (${user.username})`,
                    groups: user.groups,  // Ensure groups are included in the response
                }));
                this.setState({ users });
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }

    fetchNotifications = async () => {
        try {
            const response = await axios.get(apiUrl + 'notifications/');
            this.setState({ notifications: response.data, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    render() {
        const { notifications, loading, error } = this.state;

        const columns = [
            { name: 'ID', selector: (row, index) => index + 1, sortable: true },
            { name: 'From', selector: row => row.coordinator.username, sortable: true },
            { name: 'Content', selector: row => row.content, sortable: true },
            { name: 'Sent on', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        ];

        return (
            <>
                <div className="pagetitle">
                    <h1>Broadcast Notification</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">Broadcast</li>
                        </ol>
                    </nav>
                </div>

                <div className='card'>
                    <div className="card-body">
                        <h5 className="card-title">
                            Broadcast Notifications
                        </h5>
                        {loading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        {!loading && !error && (
                            <DataTable
                                columns={columns}
                                data={notifications}
                                pagination
                            />
                        )}
                    </div>

                </div>
            </>
        );
    }
}
