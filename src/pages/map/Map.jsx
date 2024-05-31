import React, { Component } from 'react'
import '../seats/Chimwaga.css';
const apiUrl = import.meta.env.VITE_API_URL;
import axios from '../../axiosInstance'
import logo  from '../../assets/img/logo.png'
import {useLocation} from 'react-router-dom'

function generateSeats(row, id = "") {
    const seats = [];
    for (let i = 1; i <= row.number_of_seats; i++) {
        const newId = id + `-C${i}`;
        // const response = await axios.post(apiUrl + 'seats/', {row: row.id, seat_number: i, ticket: newId});
        seats.push(<div className={`seat ${newId}`} key={i} id={newId} data-toggle="tooltip" data-placement="top" title={`Seat: ${newId}`}></div>);
    }

    return seats
}

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 0.2,
            isDragging: false,
            lastX: null,
            lastY: null,
            rows: [],
            seating_plan: [],
            link: "",
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
                axios.get(apiUrl + `seating_plan/?link=${this.state.link}`)
                    .then((response) => {
                        this.setState((prevState) => ({
                            ...prevState,
                            seating_plan: response.data.filter((seat) => {
                                return seat.user_details != null;
                            }),
                        }), () => {
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

            .catch(error => {
                console.log(error);
            })
    }


    componentDidMount() {
        // Add event listeners with passive: false option
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });
        this.container.addEventListener('touchmove', this.handlePinch, { passive: false });

        const queryParams = new URLSearchParams(location.search);
        const link = queryParams.get('q');
        this.setState(prevState=>({
            ...prevState,
            link
        }), ()=>{
            this.reload();
        })
    }
    render() {
        const { scale, translateX, translateY, lastX, lastY } = this.state;
        return (
            <div className='container'>

                <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto" >
                        <img src={logo} alt="logo" />
                        <span className="d-none d-lg-block">UDOM GSCS</span>
                    </a>
                </div>
                <div className='row'>
                    <div className="col-lg-8">
                        <div className='card'>
                            <div className="card-body">
                                <h5 className="card-title"><i className="bi bi-bank"></i> Chimwaga Hall</h5>
                                <ul className="nav nav-tabs nav-tabs-bordered" id="borderedTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="true" tabIndex="-1">Map</button>
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
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Ticket Number</h5>
                                <div>
                                    {(this.state.seating_plan.length == 1) ? (this.state.seating_plan[0].user_details.ticket) : ("-")}
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title"><i className="bi bi-calendar3"></i> Graduation Date</h5>
                                23<sup>rd</sup> November, 2024
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title"><i className='bi bi-map'></i> Graduation Venue</h5>

                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.435068146697!2d35.792521274998194!3d-6.206201360793992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184dfb19d5bc11d9%3A0xf118dd4224e1e44!2sChimwaga%20Complex%2C%20University%20of!5e0!3m2!1sen!2stz!4v1713362895707!5m2!1sen!2stz" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" width="100%" height="100%" style={{ aspectRatio: 1 / 1 }}></iframe>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        )
    }
}
