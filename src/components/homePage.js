import React, { Component } from "react";
// import img5 from "./../assets/img/nonprofits/brad-weaver-7IBmf8uH4WY-unsplash.jpg";
// import img2 from "./../assets/img/nonprofits/joel-muniz-qvzjG2pF4bE-unsplash.jpg";
// import img4 from "./../assets/img/nonprofits/tyler-lagalo-ZU94isADXDs-unsplash.jpg";
import "./../assets/css/styles.css";
import TypesSection from "./typesSection";
import SearchBar from "./searchBar";

export default class HomePage extends Component {
  render() {
    return (
      <main className="page landing-page">
        <section className="portfolio-block block-intro">
          <div className="container">
            <div className="p-2 bg-light round-3">
              <div className="container-fluid py-5">
                <div className="row">
                  <div className="col">
                    <h1 className="display-5 fw-bold m-4 welcome-h1 text-center">
                      Welcome!
                    </h1>
                    <p className="welcome-p m-4 text-center">
                      This prototype was built to show what common, open source
                      infrastructure for the nonprofit sector would look like
                      and could be used for. The information we have gathered
                      focuses on existing open data sources about nonprofit
                      organizations, grants, and evaluations. We think this
                      information can be used in various ways by the sector;
                      from helping to learn more about the sector, to program
                      design and shared learnings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <SearchBar />
        <section>
          <TypesSection />
        </section>
        {/* <section className="portfolio-block">
          <div className="container">
            <div className="row g-0">
              <div className="col-md-6 col-lg-4 item zoom-on-hover">
                <a href="/home">
                  <img src={img5} className="img-fluid image hp-img" alt="" />
                </a>
              </div>
              <div className="col-md-6 col-lg-4 item zoom-on-hover">
                <a href="/home">
                  <img className="img-fluid image hp-img" src={img2} alt="" />
                </a>
              </div>
              <div className="col-md-6 col-lg-4 item zoom-on-hover">
                <a href="/home">
                  <img className="img-fluid image hp-img" src={img4} alt="" />
                </a>
              </div>
            </div>
          </div>
        </section> */}
      </main>
    );
  }
}
