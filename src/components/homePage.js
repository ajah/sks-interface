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
              <div className="container-fluid pt-5">
                <div className="row">
                  <div className="col">
                    <h1 className="display-5 fw-bold m-4 welcome-h1 text-center">
                      Sector Knowledge Sharing Hub (Beta)
                    </h1>
                    <p className="welcome-p m-4 text-center">
                      The SKS Hub is a prototype project intended to demonstrate
                      the value of shared, open knowledge infrastructure for the
                      nonprofit sector. The Hub collects information from
                      existing data sources about nonprofit organizations and
                      their activities, and makes it possible to search, filter,
                      and navigate this information for sector leaders,
                      advocates, researchers, and practitioners. To use the
                      tool, simply search the data by choosing keywords related
                      to your particular interests or focus, and use the filters
                      and controls on the search page to further refine your
                      results.
                    </p>
                    <a href="/about-us">
                      <p>To learn more, click here</p>
                    </a>
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
