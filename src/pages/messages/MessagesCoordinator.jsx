import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import axios from '../../axiosInstance';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

class MessagesCoordinator extends Component {
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
        this.fetchStudents();
        this.fetchReports();
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

    fetchStudents = () => {
        axios.get(apiUrl + 'users/')
            .then(response => {
                this.setState({ students: response.data });
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }

    fetchReports = () => {
        axios.get(apiUrl + 'reports/')
            .then(response => {
                this.setState({ reports: response.data });
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
            });
    }

    handleMessageChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newMessage: {
                ...prevState.newMessage,
                [name]: value,
            }
        }));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { newMessage } = this.state;
        const {content, report} = newMessage;
        const student_id = newMessage.student;

        const message = {content, report, student_id}
        axios.post(apiUrl + 'messages/', newMessage)
            .then(response => {
                this.fetchMessages();
                this.setState({
                    newMessage: {
                        content: '',
                        student: '',
                        report: '',
                    }
                });
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }

    render() {
        const { messages, students, reports, newMessage } = this.state;

        const columns = [
            {
                name: 'ID',
                selector: (row, index)=> index + 1,
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
                selector: row=>row.created_at,
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
                <div className="row">
                    <div className="col-lg-8">
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
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">New Message</h5>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="mb-3">
                                        <textarea
                                            type="text"
                                            id="content"
                                            name="content"
                                            value={newMessage.content}
                                            onChange={this.handleMessageChange}
                                            className='form-control'
                                            placeholder='New Message'
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            id="student"
                                            name="student"
                                            value={newMessage.student}
                                            onChange={this.handleMessageChange}
                                            className='form-control'
                                            required
                                        >
                                            <option value="">Select Student</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            id="report"
                                            name="report"
                                            value={newMessage.report}
                                            onChange={this.handleMessageChange}
                                            className='form-control'
                                        >
                                            <option value="">Select Report (optional)</option>
                                            {reports.filter((report)=> {
                                                return report.student.id == newMessage.student;
                                            }).map(report => (
                                                <option key={report.id} value={report.id}>
                                                    {report.reference_token}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className='btn btn-primary'>Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default MessagesCoordinator;
