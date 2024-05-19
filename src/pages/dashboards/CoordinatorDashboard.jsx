import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { DataTable } from 'simple-datatables';

const apiUrl = import.meta.env.VITE_API_URL;

export default class CoordinatorDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            "graduates_count": null,
            "guests_count": null,
            "students": null,
            "guests": null,
            "new_student": {
                user: {
                    username: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    password: '',
                },
                graduation_status: 'EX',
                degree_program: '',
                degree_level: '',
                college: '',
            },
            "new_guest":{
                "student": "",
                "name": "",
                "user": {},
                "password": "",
                "type": "PRT",
                "status": "EX"
            },
        }

        this.handleStudentRegistration = this.handleStudentRegistration.bind(this)
        this.handleGuestRegistration = this.handleGuestRegistration.bind(this)
    }
    componentDidMount(){
        // get students
        axios.get(apiUrl + 'students/')
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const students = response.data;
            const graduates = students.filter((student)=>{
                return student.graduation_status == "EX"
            })

            this.setState(prevState => ({
                graduates_count: {
                    ...prevState.graduates_count, 
                    expected: graduates.length,
                    postponed: students.length - graduates.length,
                },
                students,
            }), () => {

            });
            setTimeout(() =>{
                const students_table = document.querySelector('.students-datatable');
                const students_datatable = new DataTable(students_table)
            }, 0)

        })
        .catch(error => {
            console.error(error)
        })

        // get guests
        axios.get(apiUrl + "guests/")
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const guests = response.data;
            const expected = guests.filter((guest)=>{
                return guest.status == "EX"
            })


            this.setState(prevState => ({
                guests_count: {
                    ...prevState.guests_count,
                    expected: expected.length,
                    postponed: guests.length - expected.length,
                },
                guests
            }),
            ()=>{
            }
            )
            setTimeout(() => {
                const guests_table = document.querySelector('.guests-datatable')
                const guests_datatable = new DataTable(guests_table)
            }, 0)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            new_student: {
                ...prevState.new_student,
                [name]: value,
            }
        }), ()=>{
        });
    };


    handleGuestChange = (e) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            new_guest: {
                ...prevState.new_guest,
                [name]: value,
                ['user']: {
                    'username' : (name === 'name')? value: prevState.new_guest.name,
                    'password' : (name === 'password')? value: prevState.new_guest.password
                }

            }
        }), ()=>{
        });
    };
    handleStudentChange = (e) => {
        const {name, value} = e.target;

        this.setState((prevState)=> ({
            new_student: {
                ...prevState.new_student,
                user: {
                    ...prevState.new_student.user,
                    [name]: value,
                }
            }
        }))
    }

    reloadStudentsTable(){
        // get students
        axios.get(apiUrl + 'students/')
            .then(response => {
                const students = response.data;
                const graduates = students.filter((student) => {
                    return student.graduation_status == "EX"
                })

                this.setState(prevState => ({
                    graduates_count: {
                        ...prevState.graduates_count,
                        expected: graduates.length,
                        postponed: students.length - graduates.length,
                    },
                    students,
                }), () => {
                    setTimeout(()=>{
                        const students_table = document.querySelector('.students-datatable');
                        const students_datatable = new DataTable(students_table)
                    }, 200)
                });

            })
            .catch(error => {
                console.error(error)
            })
    }


    reloadGuestsTable(){
        // get guests
        axios.get(apiUrl + "guests/")
        .then(response => {
            const guests = response.data;
            const expected = guests.filter((guest)=>{
                return guest.status = "EX"
            })

            this.setState(prevState => ({
                guests_count: {
                    ...prevState.guests_count,
                    expected: expected.length,
                    postponed: guests.length - expected.length,
                },
                guests
            }),
            ()=>{
            }
            )
            setTimeout(() => {
                const guests_table = document.querySelector('.guests-datatable')
                const guests_datatable = new DataTable(guests_table)
            }, 200)
        })
        .catch(error=>{
            console.log(error);
        })
    }

    handleStudentRegistration(e){
        e.preventDefault();
        axios.post(apiUrl + 'students/', this.state.new_student)
        .then(response => {
            //clear the form
            this.setState((prevState)=>({
                new_student: {
                    ...prevState.new_student,
                    user: {
                        username: '',
                        email: '',
                        first_name: '',
                        last_name: '',
                        password: '',
                    },
                    graduation_status: 'EX',
                    degree_program: '',
                    degree_level: '',
                    college: '',
                },
            }
            ))
            this.reloadStudentsTable();
        })
        .catch(error=>{
            console.log(error)
        })

    }


    handleGuestRegistration(e){
        e.preventDefault();
        axios.post(apiUrl + 'guests/', this.state.new_guest)
        .then(response => {
            //clear the form
            this.setState((prevState)=>({
                new_guest: {
                    ...prevState.new_guest,
                    student: "",
                    name: "",
                    password: "", 
                    type: "PRT",
                    status: "EX",
                },
            }
            ))
            this.reloadGuestsTable();
        })
        .catch(error=>{
            console.log(error)
        })

    }
  render() {
    return (
        <>
            <div className="pagetitle">
                <h1>My Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="row">

                            <div className="col-xxl-6 col-md-6">
                                <div className="card info-card sales-card">
                                    <div className="filter">
                                        <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                            <li className="dropdown-header text-start">
                                                <h6>Filter</h6>
                                            </li>

                                            <li><a className="dropdown-item" href="#">Total</a></li>
                                            <li><a className="dropdown-item" href="#">Expected</a></li>
                                        </ul>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">Graduates <span>| Total</span></h5>
                                        <div className="d-flex align-items-center">
                                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                <i className="bx bxs-graduation"></i>
                                            </div>
                                            <div className="ps-3">
                                                {(this.state.graduates_count == null)?(
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                ):(
                                                    <>
                                                        <h6>{this.state.graduates_count.expected}</h6>
                                                        <span className="text-success small pt-1 fw-bold">{this.state.graduates_count.postponed}</span> <span className="text-muted small pt-2 ps-1">postponed</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="col-xxl-6 col-md-6">
                                <div className="card info-card revenue-card">
                                    <div className="filter">
                                        <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                            <li className="dropdown-header text-start">
                                                <h6>Filter</h6>
                                            </li>
                                            <li><a className="dropdown-item" href="#">Total</a></li>
                                            <li><a className="dropdown-item" href="#">Expected</a></li>
                                        </ul>
                                    </div>

                                    <div className="card-body">
                                        <h5 className="card-title">Guests <span>| Total</span></h5>

                                        <div className="d-flex align-items-center">
                                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                <i className="bi bi-people"></i>
                                            </div>
                                            <div className="ps-3">
                                                {(this.state.guests_count == null) ? (
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                            <h6>{this.state.guests_count.expected}</h6>
                                                            <span className="text-success small pt-1 fw-bold">{this.state.guests_count.postponed}</span> <span className="text-muted small pt-2 ps-1">postponed</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* registered students table */}
                            <div className="col-12">
                                <div className="card recent-sales overflow-auto">

                                    <div className="filter">
                                        <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                            <li className="dropdown-header text-start">
                                                <h6>Filter</h6>
                                            </li>

                                            <li><a className="dropdown-item" href="#">All</a></li>
                                            <li><a className="dropdown-item" href="#">Expected</a></li>
                                            <li><a className="dropdown-item" href="#">Postponed</a></li>
                                        </ul>
                                    </div>

                                    <div className="card-body">
                                        <h5 className="card-title">Graduates <span>| All</span></h5>

                                            
                                                {(this.state.students == null) ? (
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
                                                                    this.state.students.map((student)=>(
                                                                        <tr key={student.id}>
                                                                            <th scope="row"><a href="#">{student.user.username}</a></th>
                                                                            <td>{student.user.first_name + " " + student.user.last_name}</td>
                                                                            <td><a href="#" className="text-primary">{student.college}</a></td>
                                                                            <td>{student.degree_level}</td>
                                                                            <td>{student.degree_program}</td>
                                                                            {
                                                                                (student.graduation_status == "EX")?(
                                                                                    <td><span className="badge bg-success">Expected</span></td>
                                                                                ):(
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

                            {/*registerd guests table*/}
                            <div className="col-12">
                                <div className="card recent-sales overflow-auto">

                                    <div className="filter">
                                        <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                            <li className="dropdown-header text-start">
                                                <h6>Filter</h6>
                                            </li>

                                            <li><a className="dropdown-item" href="#">All</a></li>
                                            <li><a className="dropdown-item" href="#">Expected</a></li>
                                            <li><a className="dropdown-item" href="#">Postponed</a></li>
                                        </ul>
                                    </div>


                                    <div className="card-body">
                                        <h5 className="card-title">Guests <span>| All</span></h5>


                                        {(this.state.guests == null) ? (
                                            <div className="spinner-border text-primary d-flex justify-content-center" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                                <>
                                                    <table className="table table-borderless guests-datatable">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Reg. No</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Type</th>
                                                                <th scope="col">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.guests.map(guest => (
                                                                <tr key={guest.id}>
                                                                    <th scope="row"><a href="#">{guest.student}</a></th>
                                                                    <td>{guest.name}</td>
                                                                    <td>{guest.type}</td>
                                                                    {
                                                                        (guest.status === "EX") ? (
                                                                            <td><span className="badge bg-success">Expected</span></td>
                                                                        ) : (
                                                                            <td><span className="badge bg-danger">Postponed</span></td>
                                                                        )
                                                                    }
                                                                </tr>
                                                            ))}
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
                        {/* Students registration form*/}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Register Student</h5>
                                <div>
                                    <form onSubmit={this.handleStudentRegistration}>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="username"
                                                    value={this.state.new_student.user.username}
                                                    onChange={this.handleStudentChange}
                                                    placeholder='Registration Number'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="inputEmail"
                                                    name="email"
                                                    value={this.state.new_student.user.email}
                                                    onChange={this.handleStudentChange}
                                                    placeholder='example@email.com'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="first_name"
                                                    value={this.state.new_student.user.first_name}
                                                    onChange={this.handleStudentChange}
                                                    placeholder='First name'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="last_name"
                                                    value={this.state.new_student.user.last_name}
                                                    onChange={this.handleStudentChange}
                                                    placeholder='Last name'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="inputPassword"
                                                    name="password"
                                                    value={this.state.new_student.user.password}
                                                    onChange={this.handleStudentChange}
                                                    placeholder='password'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="degree_program"
                                                    value={this.state.new_student.degree_program}
                                                    onChange={this.handleChange}
                                                    placeholder='Degree Program'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="college"
                                                    value={this.state.new_student.college}
                                                    onChange={this.handleChange}
                                                    placeholder='College'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    name="degree_level"
                                                    value={this.state.new_student.degree_level}
                                                    onChange={this.handleChange}
                                                    placeholder='Degree Level'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-12">
                                                <select
                                                    className="form-select"
                                                    id="graduationStatus"
                                                    name="graduation_status"
                                                    value={this.state.new_student.graduation_status}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value="EX">Expected</option>
                                                    <option value="PP">Postponed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-10">
                                                <button type="submit" className="btn btn-primary">
                                                    Register
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Guest Registration form */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Register Guest</h5>
                                <div>
                                    <form onSubmit={this.handleGuestRegistration}>
                                        <div className="mb-3">
                                            <select
                                                className="form-select"
                                                id="student"
                                                name="student"
                                                value={this.state.new_guest.student}
                                                onChange={this.handleGuestChange}
                                            >
                                                <option value="">Student</option>
                                                {(this.state.students != null)?
                                                (
                                                    this.state.students.map((student, index)=>{
                                                        return (<option key={index} value={student.user.username}>{student.user.username}</option>)
                                                    })
                                                ):(
                                                    <></>
                                                )}
                                            </select>
                                        </div>
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
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="name"
                                                name="password"
                                                value={this.state.new_guest.password}
                                                placeholder='password'
                                                onChange={this.handleGuestChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <select
                                                className="form-select"
                                                id="type"
                                                name="type"
                                                value={this.state.new_guest.type}
                                                onChange={this.handleGuestChange}
                                            >
                                                <option value="PRT">Parent</option>
                                                <option value="VIP">VIP</option>
                                            </select>
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
                                        <button type="submit" className="btn btn-primary">
                                            Register
                                        </button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
  }
}
