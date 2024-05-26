import { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axiosInstance'
const apiUrl = import.meta.env.VITE_API_URL;

export default class Timetable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            timetable: [],
        }
    }
    componentDidMount() {
        axios.get(apiUrl + 'timetable/')
            .then(response => {
                this.setState(() => ({ timetable: response.data }))
            })
            .catch(error => {
                console.log(error)
            })
    }
    render() {
        return (
            <>
                <div className="pagetitle">
                    <h1>Timetable</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">Timetable</li>
                        </ol>
                    </nav>
                </div>
                <div className='card'>
                    <div className="card-body">
                        <h5 className="card-title"><i className="bi bi-table"></i> Graduation Timetable</h5>
                        <div className="table-responsive">
                            {(this.state.timetable == null) ? (
                                <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.timetable.map((event, index) => 
                                                (
                                                    <tr key={index}>
                                                        <td>{event.start_time}</td>
                                                        <td>{event.end_time}</td>
                                                        <td>{event.event_name}</td>
                                                        <td>{event.event_description}</td>
                                                    </tr>
                                                )
                                            )
                                        }
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
