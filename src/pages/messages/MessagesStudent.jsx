import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import axios from '../../axiosInstance';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

class MessagesStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            students: [],
            reports: [],
            newMessage: {
                content: '',
                student: '',
                report: '',
            },
        };
    }

    componentDidMount() {
        this.fetchMessages();
    }

    fetchMessages = () => {
        axios.get(apiUrl + 'messages/')
            .then(response => {
                this.setState({ messages: response.data });
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    }

    render() {
        const { messages, students, reports, newMessage } = this.state;

        const columns = [
            {
                name: 'ID',
                selector: (row, index) => index + 1,
                sortable: true,
            },
            {
                name: 'Content',
                selector: row => row.content,
                sortable: true,
            },
            {
                name: 'To',
                selector: row => row.student.username,
                sortable: true,
            },
            {
                name: 'Report',
                selector: row => row.report_token ? row.report_token : 'N/A',
                sortable: true,
            },
            {
                name: 'Sent On',
                selector: row => row.created_at,
                sortable: true,
            },
        ];

        return (
            <>
                <div className="pagetitle">
                    <h1>My Messages</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">Messages</li>
                        </ol>
                    </nav>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Messages</h5>
                        <DataTable
                            columns={columns}
                            data={messages}
                            pagination
                            highlightOnHover
                        />
                    </div>
                </div>

            </>
        );
    }
}

export default MessagesStudent;
