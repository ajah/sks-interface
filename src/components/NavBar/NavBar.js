import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandsHelping } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import './NavBar.css'

export class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark navbar-expand-lg fixed-top bg-white portfolio-navbar gradient">
        <div className="container">
          <FontAwesomeIcon className="navbar-icon" icon={faHandsHelping} />
          <a className="navbar-brand logo" href="/">
            Sector Knowledge Sharing Hub
          </a>
          <button
            data-bs-toggle="collapse"
            className="navbar-toggler"
            data-bs-target="#navbarNav"
          >
            <span className="visually-hidden">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/search">
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/about-us">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <section></section>
        </div>
      </nav>
    )
  }
}

export default NavBar
