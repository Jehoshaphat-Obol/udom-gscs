import React, { Component } from 'react';
import Select from 'react-select';
import axios from '../../axiosInstance';
import authService from '../../services/authService';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
import DataTable from 'react-data-table-component';

export default class NotificationCoordinator extends Component {
    state = {
        users: [],
        selectedUsers: [],
        content: '',
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

    handleSelectChange = selectedUsers => {
        this.setState({ selectedUsers });
    };

    handleContentChange = event => {
        this.setState({ content: event.target.value });
    };

    handleSelectAll = role => {
        const { users } = this.state;
        const selectedUsers = users.filter(user => {
            return user.groups.includes(role)
        });
        this.setState({ selectedUsers });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { selectedUsers, content } = this.state;
        const user_ids = selectedUsers.map(user => user.value);

        axios.post(`${apiUrl}notifications/`, { user_ids, content })
            .then(response => {
                this.fetchNotifications();
            })
            .catch(error => {
                console.error('There was an error sending the notification!', error);
            });
    };

    fetchNotifications = async () => {
        try {
            const response = await axios.get(apiUrl + 'notifications/');
            this.setState({ notifications: response.data, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    render() {
        const { users, selectedUsers, content } = this.state;
        const currentUser = authService.getCurrentUser();
        const { notifications, loading, error } = this.state;

        const columns = [
            { name: 'ID', selector: (row, index) => index + 1, sortable: true },
            { name: 'Coordinator', selector: row => row.coordinator.username, sortable: true },
            { name: 'Content', selector: row => row.content, sortable: true },
            { name: 'Created At', selector: row => new Date(row.created_at).toLocaleString(), sortable: true },
        ];
        return (
            <>
                <div className="pagetitle">
                    <h1>Broadcast Notification</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">Notification</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <div className='card'>
                            <div className="card-body">
                                <h5 className="card-title">
                                    Notifications
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
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Create Notification</h5>
                                <form onSubmit={this.handleSubmit}>
                                    <div>
                                        <button type="button" className='btn btn-info mb-3 w-full' style={{ marginRight: '16px' }} onClick={() => this.handleSelectAll('student')}>Select All Students</button>
                                        <button type="button" className='btn btn-info mb-3 w-full' style={{ marginRight: '16px' }} onClick={() => this.handleSelectAll('guest')}>Select All Guests</button>
                                        <Select
                                            isMulti
                                            value={selectedUsers}
                                            onChange={this.handleSelectChange}
                                            options={users}
                                            placeholder="Select Users"
                                            className='mb-3'
                                        />
                                    </div>
                                    <div>
                                        <textarea value={content} className='form-control mb-3' onChange={this.handleContentChange} required placeholder='Enter Message here' />
                                    </div>
                                    <button type="submit" className='btn btn-primary'>Send Notification</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
