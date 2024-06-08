import React, { Component } from 'react'
import logo from '../assets/img/logo.png'
import profile from '../assets/img/profile-img.png'
import authService from '../services/authService';
import Notifications from './Notifications';
import Messages from './Messages';

export default class Header extends Component {
    constructor(props){
        super(props);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
    }
    toggleSidebar(){
        document.querySelector('body').classList.toggle('toggle-sidebar');
    }

    toggleSearchBar(){
        document.querySelector('.search-bar').classList.toggle('search-bar-show');
    }
  render() {
    const currentUser = authService.getCurrentUser();
    return (
      <>
        <div className="d-flex align-items-center justify-content-between">
            <span href="index.html" className="logo d-flex align-items-center">
                <img src={logo} alt="" />
                    <span className="d-none d-lg-block">UDOM GSCS</span>
            </span>
            <i className="bi bi-list toggle-sidebar-btn" onClick={this.toggleSidebar}></i>
        </div>
{/* 
        <div className="search-bar">
            <form className="search-form d-flex align-items-center" method="POST" action="#">
                <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
                <button type="submit" title="Search"><i className="bi bi-search"></i></button>
            </form>
        </div> */}

        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
                {/* <li className="nav-item d-block d-lg-none">
                    <a className="nav-link nav-icon search-bar-toggle " onClick={this.toggleSearchBar} href="#">
                        <i className="bi bi-search"></i>
                    </a>
                </li> */}
                <Notifications />
                <Messages />

                <li className="nav-item dropdown pe-3">

                        <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                            <img src={profile} alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">{currentUser.username}</span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{currentUser.username}</h6>
                                <span>{currentUser.groups.map(group=>(group))}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <span className="dropdown-item d-flex align-items-center" style={{cursor: 'pointer'}} onClick={authService.logout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </span>
                            </li>

                        </ul>
                </li>

            </ul>
        </nav>
      </>
    )
  }
}
