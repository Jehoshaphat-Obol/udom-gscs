import React, { Component } from 'react'
import not_found from '../../assets/img/not-found.svg'
import { Link } from 'react-router-dom'

export default class Error404 extends Component {
  render() {
    return (
      <>
        <div className="container">
            <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>404</h1>
                <h2>The page you are looking for doesn't exist.</h2>
                <Link to="/" className="btn">Back to home</Link>
                <img src={not_found} className="img-fluid py-5" alt="Page Not Found" />
            </section>
        </div>
      </>
    )
  }
}
