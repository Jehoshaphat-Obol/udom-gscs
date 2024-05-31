import { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axiosInstance'
const apiUrl = import.meta.env.VITE_API_URL;

export default class CoordinatorTimetable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            timetable: [],
            form: {
                event_name: '',
                event_description: '',
                start_time: '',
                end_time: '',
                error: ''
            },
        }
    }

    handleChange = (e) => {
        this.setState(prevState => ({
            ...prevState,
            form: {
                ...prevState.form,
                [e.target.name]: e.target.value,
            }
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { event_name, event_description, start_time, end_time } = this.state.form;

        // Validate input fields (optional)
        if (!event_name || !start_time || !end_time) {
            return;
        }

        const timetableData = {
            event_name,
            event_description,
            start_time,
            end_time
        };

        axios.post(apiUrl + 'timetable/', timetableData)
            .then(response => {
                console.log(response.data);
                // Reset form and state
                this.setState(prevState => ({
                    ...prevState,
                    form: {
                        event_name: '',
                        event_description: '',
                        start_time: '',
                        end_time: '',
                        error: ''
                    },
                }), ()=>{
                    this.reload();
                }
                );
                // Optionally, notify the parent component or navigate
            })
            .catch(error => {
                console.error('There was an error adding the timetable!', error);
                this.setState({ error: 'There was an error adding the timetable!' });
            });
    };

    reload(){
        axios.get(apiUrl + 'timetable/')
        .then(response => {
            this.setState((prevState) => ({
                ...prevState,
                 timetable: response.data 
                }))
        })
        .catch(error => {
            console.log(error)
        })
    }
    componentDidMount() {
        this.reload();
    }
    render() {
        const { event_name, event_description, start_time, end_time } = this.state.form;
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
                <div className="row">
                    <div className="col-lg-8">
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
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Add Event</h5>
                                <form onSubmit={this.handleSubmit}>
                                        <input
                                            type="text"
                                            name="event_name"
                                            value={event_name}
                                            onChange={this.handleChange}
                                            className='form-control mb-3'
                                            placeholder='Event Name'
                                            required
                                        />
                                        <textarea
                                            name="event_description"
                                            value={event_description}
                                            onChange={this.handleChange}
                                            className='form-control mb-3'
                                            placeholder='Event description'
                                        />
                                        <input
                                            type="datetime-local"
                                            name="start_time"
                                            value={start_time}
                                            onChange={this.handleChange}
                                            required
                                            placeholder='Start Time'
                                            className='form-control mb-3'
                                        />
                                        <input
                                            type="datetime-local"
                                            name="end_time"
                                            value={end_time}
                                            onChange={this.handleChange}
                                            placeholder="End Time"
                                            className='form-control mb-3'
                                            required
                                        />
                                    <button type="submit" className='btn btn-primary'>Add Event</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
