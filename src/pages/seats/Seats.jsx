import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Chimwaga from './Chimwaga'

export default class Seats extends Component {
  render() {
    return (
      <>
        <div className="pagetitle">
          <h1>My Seat</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Seats</li>
            </ol>
          </nav>
        </div>
        <Chimwaga />
      </>
    )
  }
}
