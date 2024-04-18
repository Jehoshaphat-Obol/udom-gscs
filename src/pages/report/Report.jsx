import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Report extends Component {
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
            <div className='card'>
                <div className="card-body">
                    <h5 className="card-title"><i className="bi bi-card-list"></i> Reports</h5>
                </div>
            </div>
        </>
    )
  }
}
