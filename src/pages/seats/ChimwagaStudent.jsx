import React, { Component } from 'react'
import './Chimwaga.css';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from '../../axiosInstance'
import { DataTable } from 'simple-datatables';
import authService from '../../services/authService';


function generateSeats(row, id = "") {
    const seats = [];
    for (let i = 1; i <= row.number_of_seats; i++) {
        const newId = id + `-C${i}`;
        // const response = await axios.post(apiUrl + 'seats/', {row: row.id, seat_number: i, ticket: newId});
        seats.push(<div className={`seat ${newId}`} key={i} id={newId} data-toggle="tooltip" data-placement="top" title={`Seat: ${newId}`}></div>);
    }

    return seats
}

export default class ChimwagaStudent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 0.2,
            isDragging: false,
            lastX: null,
            lastY: null,
            unassignedStudents: null,
            unassignedGuests: null,
            assignedStudents: null,
            selected: [],
            selectedGuests: [],
            rows: [],
            tickets: [],
            form: {
                from: "",
                to: "",
            },
            seating_plan: [],
            new_guest: {
                student: authService.getCurrentUser().username,
                name: "",
                type: "PRT",
                status: "EX",
            },
        }

        this.handleGuestChange = this.handleGuestChange.bind(this);
        this.addParent = this.addParent.bind(this)
    }

    handleWheel = (e) => {
        e.preventDefault();

        const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05; // adjust scalefacto based on scroll direction
        this.setState((prevState) => (
            {
                ...prevState,
                scale: prevState.scale * scaleFactor,
            }
        ))
    }

    handleMouseDown = (e) => {
        e.preventDefault();
        this.setState((prevState) => ({
            ...prevState,
            isDragging: true,
            lastX: e.clientX,
            lastY: e.clientY
        }));
    };

    handleMouseMove = (e) => {
        if (!this.state.isDragging) return;
        const deltaX = e.clientX - this.state.lastX;
        const deltaY = e.clientY - this.state.lastY;
        this.setState((prevState) => ({
            ...prevState,
            lastX: e.clientX,
            lastY: e.clientY,
            // Update position based on drag delta
            translateX: (prevState.translateX || 0) + deltaX,
            translateY: (prevState.translateY || 0) + deltaY
        }));
    };


    handleMouseUp = () => {
        this.setState((prevState) => ({ ...prevState, isDragging: false }));
    };

    handlePinch = (e) => {
        e.preventDefault();
        const scaleFactor = 1 + (e.scale - 1) / 2;

        this.setState((prevState) => (
            {
                ...prevState,
                scale: prevState.scale * scaleFactor,
            }
        ))
    }



    handleGuestChange = (e) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            new_guest: {
                ...prevState.new_guest,
                [name]: value,
            }
        }), () => {
        });
    };

    reload() {
        axios.get(apiUrl + 'rows/')
            .then((response) => {
                this.setState(prevState => ({
                    ...prevState,
                    rows: response.data,
                }), () => {
                    // const rows = this.state.rows;
                    // let sum = 0;
                    // rows.forEach((row) => {
                    //     sum += row.number_of_seats;
                    // })
                }, () => {

                })
                axios.get(apiUrl + 'seating_plan/')
                    .then((response) => {
                        this.setState((prevState) => ({
                            ...prevState,
                            seating_plan: response.data.filter((seat) => {
                                return seat.user_details != null;
                            }),
                        }), () => {
                            const seating_plan_datatable = new DataTable('.seatingplan-datatable');

                            this.state.seating_plan.forEach((seat, index) => {
                                const chair = document.querySelector(`.seat.${seat.user_details.ticket}#${seat.user_details.ticket}`);
                                chair.classList.add('taken');
                                chair.style = 'background: orange'

                                if (seat.user_details.type == "student") {
                                    chair.title = `Seat: ${seat.user_details.ticket}, ${seat.user_details.type}, ${seat.user_details.name}, ${seat.user_details.college}, ${seat.user_details.degree_program}, ${seat.user_details.degree_level}`
                                } else if (seat.user_details.type == "guest") {
                                    chair.title = `Seat: ${seat.user_details.ticket}, ${seat.user_details.guest_type}, ${seat.user_details.name}, ${seat.user_details.student}`
                                }
                            })
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    addParent() {
        const guest = this.state.new_guest;
        axios.post(apiUrl + 'parents/', guest)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        // Add event listeners with passive: false option
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });
        this.container.addEventListener('touchmove', this.handlePinch, { passive: false });

        this.reload();
    }
    render() {
        const { scale, translateX, translateY, lastX, lastY } = this.state;
        return (
            <div className='row'>
                <div className="col-lg-8">
                    <div className='card'>
                        <div className="card-body">
                            <h5 className="card-title"><i className="bi bi-bank"></i> Chimwaga Hall</h5>
                            <ul className="nav nav-tabs nav-tabs-bordered" id="borderedTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="true" tabIndex="-1">Map</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-contact" type="button" role="tab" aria-controls="contact" aria-selected="false" tabIndex="-1">Seating Plan</button>
                                </li>
                            </ul>
                            <div className="tab-content pt-2" id="borderedTabContent">
                                <div className="tab-pane fade active show" id="bordered-home" role="tabpanel" aria-labelledby="home-tab">
                                    <div
                                        className="map"
                                        onTouchEnd={() => { }}
                                        ref={(ref) => (this.container = ref)}
                                        onMouseDown={this.handleMouseDown}
                                        onMouseMove={this.handleMouseMove}
                                        onMouseUp={this.handleMouseUp}
                                        onMouseLeave={this.handleMouseUp}
                                        style={{
                                            cursor: this.state.isDragging ? 'grabbing' : 'grab',
                                        }}
                                    >
                                        <div
                                            style={{
                                                transform: `scale(${scale}) translate(${translateX || 0}px, ${translateY || 0}px)`,
                                                transformOrigin: `${translateX || 0}px ${translateY || 0}px`,
                                                display: "flex",
                                                justifyContent: "center",
                                                flexFlow: 'column nowrap',
                                                width: "fit-content",
                                            }}>
                                            <div className='d-flex' style={{ width: "-webkit-fill-available", justifyContent: "center" }}>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(0, 12).map((row, index) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `FL-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(12, 24).map((row, index) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `FC-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(24, 36).map((row, index) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `FR-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex' style={{ width: "-webkit-fill-available", justifyContent: "center" }}>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(36, 47).map((row, index) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `ML-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(47, 58).map((row, index) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `MC-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(58, 69).map((row, index) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `MR-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex' style={{ width: "-webkit-fill-available", justifyContent: "center" }}>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(69, 81).map((row, index) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `BL-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(81, 93).map((row, index) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `BC-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        this.state.rows.slice(93, 105).map((row, index) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row, `BR-R${index + 1}`)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="bordered-contact" role="tabpanel" aria-labelledby="contact-tab">

                                    {(this.state.seating_plan == null) ? (
                                        <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <table className="table table-borderless seatingplan-datatable">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Ticket</th>
                                                        <th scope="col">Student Id</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.seating_plan.map((seat, index) => (
                                                            <tr key={index}>
                                                                <td>{seat.user_details.name}</td>
                                                                <td>{seat.user_details.type}</td>
                                                                {
                                                                    (seat.user_details.status === "EX") ? (
                                                                        <td><span className="badge bg-success">Expected</span></td>
                                                                    ) : (
                                                                        <td><span className="badge bg-danger">Postponed</span></td>
                                                                    )
                                                                }
                                                                <td>{seat.user_details.ticket}</td>
                                                                <td>{seat.user_details.student}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-lg-4">

                    {/* Guest Registration form */}
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Register Guest</h5>
                            <div>
                                <form onSubmit={this.handleGuestRegistration}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={this.state.new_guest.name}
                                            placeholder='Name'
                                            onChange={this.handleGuestChange}
                                        />
                                    </div>

                                    <div className="mb-3">

                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={this.state.new_guest.status}
                                            onChange={this.handleGuestChange}
                                        >
                                            <option value="EX">Expected</option>
                                            <option value="PP">Postponed</option>
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={this.addParent}>
                                        Register
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}