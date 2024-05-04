import React, { Component } from 'react'
import './Chimwaga.css';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from 'axios'


function generateSeats(row, id = "") {
    const seats = [];
    for (let i = 1; i <= row.number_of_seats; i++) {
        const newId = id + `-C${i}`;
        seats.push(<div className='seat' key={i} id={newId}></div>);
    }

    return seats
}

export default class Chimwaga extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 0.2,
            isDragging: false,
            lastX: null,
            lastY: null,
            unassignedStudents: null,
            assignedStudents: null,
            rows: [],
            form: {
                from: "",
                to: "",
            },
        }
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
        this.setState({
            isDragging: true,
            lastX: e.clientX,
            lastY: e.clientY
        });
    };

    handleMouseMove = (e) => {
        if (!this.state.isDragging) return;
        const deltaX = e.clientX - this.state.lastX;
        const deltaY = e.clientY - this.state.lastY;
        this.setState((prevState) => ({
            lastX: e.clientX,
            lastY: e.clientY,
            // Update position based on drag delta
            translateX: (prevState.translateX || 0) + deltaX,
            translateY: (prevState.translateY || 0) + deltaY
        }));
    };


    handleMouseUp = () => {
        this.setState({ isDragging: false });
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

    handleFromChange = (e) => {
        const from = e.target.value.toUpperCase();
        this.setState(prevState => (
            {
                ...prevState,
                form: {
                    ...prevState.form,
                    from
                }
            }
        ), () => {
            const seats = document.querySelectorAll('.seat')

            seats.forEach(seat => {
                seat.style = "background: transparent";
            })

            if (from) {
                const seat = document.querySelector(`#${from}`);
                if (seat) {
                    seat.style = "background: blue;"
                }

                if (this.state.form.to && this.state.form.from) {

                    seats.forEach(seat => {
                        seat.style = "background: transparent";
                    })
                    let fromIndex, toIndex;
                    seats.forEach((seat, index) => {
                        if (seat.id == `${this.state.form.from}`) {
                            fromIndex = index;
                        }
                        if (seat.id == `${this.state.form.to}`) {
                            toIndex = index;
                        }
                    })

                    console.log(fromIndex, toIndex);
                    if (fromIndex <= toIndex) {
                        for (let i = fromIndex; i <= toIndex; i++) {
                            seats[i].style = "background: blue;"
                        }
                    }
                }
            }
        })
    }

    handleToChange = (e) => {
        const to = e.target.value.toUpperCase();
        this.setState(prevState => (
            {
                ...prevState,
                form: {
                    ...prevState.form,
                    to
                }
            }
        ), () => {
            const seats = document.querySelectorAll('.seat')


            seats.forEach(seat => {
                seat.style = "background: transparent";
            })

            if (to && this.state.form.from) {
                let fromIndex, toIndex;
                seats.forEach((seat, index) => {
                    if (seat.id == `${this.state.form.from}`) {
                        fromIndex = index;
                    }
                    if (seat.id == `${to}`) {
                        toIndex = index;
                    }
                })

                console.log(fromIndex, toIndex);
                if (fromIndex <= toIndex) {
                    for (let i = fromIndex; i <= toIndex; i++) {
                        seats[i].style = "background: blue;"
                    }
                }
            }
        })
    }

    componentDidMount() {
        // Add event listeners with passive: false option
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });
        this.container.addEventListener('touchmove', this.handlePinch, { passive: false });

        axios.get(apiUrl + 'students/')
            .then(response => {
                this.setState(prevState => ({
                    ...prevState,
                    assignedStudents: response.data.filter(student => {
                        return student.graduation_status == "EX"
                    }),
                    unassignedStudents: response.data.filter(student => {
                        return student.graduation_status == "EX"
                    }),
                }))
            })
            .catch(error => {
                console.log(error)
            })

        axios.get(apiUrl + 'rows/')
            .then((response) => {
                this.setState(prevState => ({
                    ...prevState,
                    rows: response.data,
                }))
            })
            .catch((error) => {
                console.log(error)
            })
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
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Unassigned Students</button>
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
                                <div className="tab-pane fade" id="bordered-profile" role="tabpanel" aria-labelledby="profile-tab">

                                    {(this.state.unassignedStudents == null) ? (
                                        <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <table className="table table-borderless students-datatable">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Reg. No</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Collage</th>
                                                        <th scope="col">Degree Level</th>
                                                        <th scope="col">Program</th>
                                                        <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.unassignedStudents.map((student) => (
                                                            <tr key={student.id}>
                                                                <th scope="row"><a href="#">{student.user.username}</a></th>
                                                                <td>{student.user.first_name + " " + student.user.last_name}</td>
                                                                <td><a href="#" className="text-primary">{student.college}</a></td>
                                                                <td>{student.degree_level}</td>
                                                                <td>{student.degree_program}</td>
                                                                {
                                                                    (student.graduation_status == "EX") ? (
                                                                        <td><span className="badge bg-success">Expected</span></td>
                                                                    ) : (
                                                                        <td><span className="badge bg-danger">Postponed</span></td>
                                                                    )
                                                                }
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                                <div className="tab-pane fade" id="bordered-contact" role="tabpanel" aria-labelledby="contact-tab">

                                    {(this.state.assignedStudents == null) ? (
                                        <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <table className="table table-borderless students-datatable">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Reg. No</th>
                                                        <th scope="col">Name</th>
                                                        <th scope="col">Collage</th>
                                                        <th scope="col">Degree Level</th>
                                                        <th scope="col">Program</th>
                                                        <th scope="col">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.assignedStudents.map((student) => (
                                                            <tr key={student.id}>
                                                                <th scope="row"><a href="#">{student.user.username}</a></th>
                                                                <td>{student.user.first_name + " " + student.user.last_name}</td>
                                                                <td><a href="#" className="text-primary">{student.college}</a></td>
                                                                <td>{student.degree_level}</td>
                                                                <td>{student.degree_program}</td>
                                                                {
                                                                    (student.graduation_status == "EX") ? (
                                                                        <td><span className="badge bg-success">Expected</span></td>
                                                                    ) : (
                                                                        <td><span className="badge bg-danger">Postponed</span></td>
                                                                    )
                                                                }
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
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Assign Seats</h5>
                            <div>
                                <form onSubmit={() => (false)}>
                                    <div className="mb-3">
                                        <input type="text" placeholder="From" className="form-control" onChange={this.handleFromChange} value={this.state.form.from} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" placeholder="To" className="form-control" onChange={this.handleToChange} value={this.state.form.to} />
                                    </div>
                                    <div className="mb-3">
                                        <select className='form-select'>
                                            <option value="" defaultValue={true}>Criterion 1</option>
                                            <option value="seat-1">Collage</option>
                                            <option value="degree">Degree Level</option>
                                            <option value="program">Program</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select className='form-select'>
                                            <option value="" defaultValue={true}>Criterion 2</option>
                                            <option value="seat-1">Collage</option>
                                            <option value="degree">Degree Level</option>
                                            <option value="program">Program</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <select className='form-select'>
                                            <option value="" defaultValue={true}>Criterion 3</option>
                                            <option value="seat-1">Collage</option>
                                            <option value="degree">Degree Level</option>
                                            <option value="program">Program</option>
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
