import React, { Component } from "react";
// import img5 from "./../assets/img/nonprofits/brad-weaver-7IBmf8uH4WY-unsplash.jpg";
// import img2 from "./../assets/img/nonprofits/joel-muniz-qvzjG2pF4bE-unsplash.jpg";
// import img4 from "./../assets/img/nonprofits/tyler-lagalo-ZU94isADXDs-unsplash.jpg";
// import "./../assets/css/styles.css";
import TypesSection from "./typesSection";
import SearchBar from "./searchBar";
import "./homePage.css";

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
                    <h1 className=" fw-bold m-4 welcome-h1 text-center">
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
                    <p className="text-start">
                      We explored various ways this prototype could support
                      different organization in their work, including:
                      <ul>
                        <li className="fs-5">
                          Helping nonprofit organizations to find other
                          organizations working in the same focus area within
                          the same geographical location, in order to connect
                          with them and share resources.
                        </li>
                        <li className="fs-5">
                          Enabling advocacy organizations to find and segment
                          organizations that represent the communities they
                          advocate for, in order to understand the level of
                          funding being received by these organizations.
                        </li>
                        <li className="fs-5">
                          Assisting foundations to find the activities being
                          carried out in their focus area or region, in order to
                          explore funding gaps or opportunities that are
                          currently not being met in these areas.
                        </li>
                      </ul>
                    </p>
                    <a href="/about-us">
                      <p>To learn more, read our about us page.</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <SearchBar isHome="true"/>
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
