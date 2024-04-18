import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Timetable extends Component {
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
                </div>
            </div>
        </>
    )
  }
}
