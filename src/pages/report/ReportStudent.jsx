import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'simple-datatables';
import axios from '../../axiosInstance';
import AuthService from '../../services/authService';
const apiUrl = import.meta.env.VITE_API_URL;

export default class ReportStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: null,
            subject: '',
            description: ''
        };
        this.dataTable = null;
    }

    componentDidMount() {
        this.fetchReports();
    }

    fetchReports = () => {
        const user = AuthService.getCurrentUser();
        if (user) {
            axios.get(`${apiUrl}reports/`)
                .then(response => {
                    this.setState({ reports: response.data }, () => {
                        if (this.dataTable) {
                            this.dataTable.destroy();
                        }
                        this.setState((prevState)=>({
                            ...prevState,
                            dataTable: new DataTable("#reports-table"),
                        }))
                    });
                }).catch(error => {
                    console.error('There was an error fetching the reports!', error);
                });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const user = AuthService.getCurrentUser();
        if (user) {
            axios.post(`${apiUrl}reports/`, {
                subject: this.state.subject,
                description: this.state.description
            }, {
                headers: {
                    Authorization: `Bearer ${user.access}`
                }
            }).then(response => {
                this.setState({ subject: '', description: '' });
                this.fetchReports();
            }).catch(error => {
                console.error('There was an error creating the report!', error);
            });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <>
                <div className="pagetitle">
                    <h1>My Reports</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">Reports</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <div className='card'>
                            <div className="card-body">
                                <h5 className="card-title"><i className="bi bi-card-list"></i> Reports</h5>

                                {(this.state.reports == null) ? (
                                    <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (<>
                                    <div className="table-responsive">
                                        <table id="reports-table" className="table">
                                            <thead>
                                                <tr>
                                                    <th>Reference Token</th>
                                                    <th>Subject</th>
                                                    <th>Description</th>
                                                    <th>Resolved</th>
                                                    <th>Created At</th>
                                                    <th>Updated At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.reports.map(report => (
                                                        <tr key={report.id}>
                                                            <td>{report.reference_token}</td>
                                                            <td>{report.subject}</td>
                                                            <td>{report.description}</td>
                                                            <td>{report.is_resolved ? (<span className="badge bg-success">Yes</span>) : (<span className="badge bg-danger">No</span>)}</td>
                                                            <td>{new Date(report.created_at).toLocaleString()}</td>
                                                            <td>{new Date(report.updated_at).toLocaleString()}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Report Form</h5>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            name="subject"
                                            value={this.state.subject}
                                            onChange={this.handleChange}
                                            placeholder='Subject'
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={this.state.description}
                                            onChange={this.handleChange}
                                            placeholder='Description'
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
