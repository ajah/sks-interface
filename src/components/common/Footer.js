import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="page-footer pt-5">
        <div className="container">
          <div className="links">
            <p>© Nonprofit Knowledge Project 2022</p>
          </div>
          <div className="social-icons">
            <a href="/">
              {/* <FontAwesomeIcon icon={} /> */}
              <i className="icon ion-social-facebook"></i>
            </a>
            <a href="/">
              <i className="icon ion-social-instagram-outline"></i>
            </a>
            <a href="/">
              <i className="icon ion-social-twitter"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
