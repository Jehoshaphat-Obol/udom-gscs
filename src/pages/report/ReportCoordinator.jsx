import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from 'simple-datatables';
import axios from '../../axiosInstance';
import AuthService from '../../services/authService';
const apiUrl = import.meta.env.VITE_API_URL;

export default class ReportCoordinator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: null,
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
                        this.setState((prevState) => ({
                            ...prevState,
                            dataTable: new DataTable("#reports-table"),
                        }))
                    });
                }).catch(error => {
                    console.error('There was an error fetching the reports!', error);
                });
        }
    }

    handleResolve = (reportId, isResolved) => {
        const user = AuthService.getCurrentUser();
        if (user) {
            axios.patch(`${apiUrl}reports/${reportId}/`, {
                is_resolved: isResolved
            })
            .then(response => {
                this.fetchReports(); // Refresh the table after updating
            }).catch(error => {
                console.error('There was an error updating the report!', error);
            });
        }
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
                    <div className="col">
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
                                                    <th>Action</th>
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
                                                            <td>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => this.handleResolve(report.id, !report.is_resolved)}
                                                                >
                                                                    {report.is_resolved ? 'Unresolved' : 'Resolved'}
                                                                </button>
                                                            </td>
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
                </div>
            </>
        );
    }
}
