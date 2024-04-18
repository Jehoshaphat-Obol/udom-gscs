import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class StudentDashboard extends Component {
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
                    <div className="col-sm-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title"><i className="bi bi-person-lines-fill"></i> My Details</h5>
                                <p><b>Name:</b> D. Baraka</p>
                                <p><b>College:</b> College of Informatics and Virtual Education (CIVE)</p>
                                <p><b>Degree:</b> Bachelors of Science</p>
                                <p><b>Programme:</b> Business Information Systems</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-4">
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
            </section>
        </>
    )
  }
}
