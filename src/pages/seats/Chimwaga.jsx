import React, { Component } from 'react'
import './Chimwaga.css';
import rows from './seats';

function generateSeats(row) {
    const seats = [];
    for (let i = 0; i < row.number_of_seats; i++) {
        seats.push(<div className='seat' key={i}></div>);
    }

    return seats
}

export default class Chimwaga extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scale: 1,
            isDragging: false,
            lastX: null,
            lastY: null
        }
    }

    handleWheel = (e) => {
        e.preventDefault();

        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1; // adjust scalefacto based on scroll direction
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
            translateX: (prevState.translateX || 0) + deltaX / prevState.scale,
            translateY: (prevState.translateY || 0) + deltaY / prevState.scale
        }));
    };


    handleMouseUp = () => {
        this.setState({ isDragging: false });
    }; h

    handlePinch = (e) => {
        e.preventDefault();
        const scaleFactor = 1 + (e.scale - 1) / 2; // adjust scale factor based on pinch gesture

        this.setState((prevState) => (
            {
                ...prevState,
                scale: prevState.scale * scaleFactor,
            }
        ))
    }


    componentDidMount() {
        // Add event listeners with passive: false option
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });
        this.container.addEventListener('touchmove', this.handlePinch, { passive: false });
    }
    render() {
        const { scale, translateX, translateY } = this.state;
        return (
            <div className='row'>
                <div className="col-lg-8">
                    <div className='card'>
                        <div className="card-body">
                            <h5 className="card-title"><i className="bi bi-bank"></i> Chimwaga Hall</h5>
                            <ul className="nav nav-tabs nav-tabs-bordered" id="borderedTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="false" tabindex="-1">Map</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Unassigned Students</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-contact" type="button" role="tab" aria-controls="contact" aria-selected="false" tabindex="-1">Seating Plan</button>
                                </li>
                            </ul>
                            <div className="tab-content pt-2" id="borderedTabContent">
                                <div className="tab-pane fade" id="bordered-home" role="tabpanel" aria-labelledby="home-tab">
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
                                                transformOrigin: 'center',
                                                display: "flex",
                                                justifyContent: "center",
                                                flexFlow: 'column nowrap',
                                            }}>
                                            <div className='d-flex'>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(0, 12).map((row) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(12, 24).map((row) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(24, 36).map((row) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex'>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(36, 47).map((row) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(47, 58).map((row) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(58, 69).map((row) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='d-flex'>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(69, 81).map((row) => {
                                                            return (
                                                                <div className="row right" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(81, 93).map((row) => {
                                                            return (
                                                                <div className="row center" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="cluster">
                                                    {
                                                        rows.slice(93, 105).map((row) => {
                                                            return (
                                                                <div className="row left" key={row.id}>
                                                                    {
                                                                        generateSeats(row)
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
                                <div className="tab-pane fade active show" id="bordered-profile" role="tabpanel" aria-labelledby="profile-tab">
                                </div>
                                <div className="tab-pane fade" id="bordered-contact" role="tabpanel" aria-labelledby="contact-tab">
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
                                <form onSubmit={false}>
                                    <div className="mb-3">
                                        <select className='form-select'>
                                            <option value="" defaultValue={true}>From</option>
                                            <option value="seat-1">Seat 1 in row 2</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select className='form-select'>
                                            <option value="" defaultValue={true}>To</option>
                                            <option value="seat-1">Seat 1 in row 4</option>
                                        </select>
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
