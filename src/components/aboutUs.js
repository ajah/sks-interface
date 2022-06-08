import React, { Component } from "react";
import "./../assets/css/styles.css";

export default class AboutUs extends Component {
  render() {
    return (
      <main className="page landing-page">
        <section className="portfolio-block block-intro">
          <div className="container">
            <div className="p-2 mb-3 bg-light round-3">
              <div className="container-fluid py-5">
                <div className="row">
                  <div className="col m-4 text-start fs-6">
                    <h1 className="display-5 fw-bold welcome-h1 text-center">
                      About The Hub
                    </h1>
                    <br />
                    {/* <p className="fw-bold">Who is involved?</p> */}
                    <p className="">
                      <span className="fw-bold">Who is involved?</span>
                      <br />
                      The{" "}
                      <a
                        href="https://sectorknowledge.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        Sector Knowledge Sharing (SKS) Hub
                      </a>
                      , led by{" "}
                      <a
                        href="https://www.ajah.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        Ajah
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://poweredbydata.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Powered by Data
                      </a>
                      , was developed as part of the DEAL Strategy, a larger
                      initiative headed by the{" "}
                      <a
                        href="https://theonn.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        Ontario Nonprofit Network
                      </a>{" "}
                      , in partnership with Ajah and Powered by Data and with
                      support from the{" "}
                      <a href="https://www.otf.ca/">
                        Ontario Trillium Foundation
                      </a>
                      . The{" "}
                      <a href="https://theonn.ca/our-work/data-priorities/deal-strategy/">
                        DEAL (Data, Evidence-use and Learning) Strategy
                      </a>{" "}
                      is exploring different shared approaches to connecting the
                      Ontario nonprofit sector’s data and knowledge to support
                      learning and evidence-informed decision-making. The
                      objective of this project is to support better programs
                      and services, public policy development, and outcomes for
                      communities across Ontario.
                    </p>
                    {/* <p className="fw-bold">
                      What is the purpose of the SKS Hub?
                    </p> */}
                    <p className="">
                      <span className="fw-bold">
                        What is the purpose of the SKS Hub?
                      </span>
                      <br />
                      The SKS Hub is a prototype project intended to demonstrate
                      the value of shared, open knowledge infrastructure for the
                      nonprofit sector. The Hub collects information from
                      existing data sources about nonprofit organizations and
                      their activities, and makes it possible to search, filter,
                      and navigate this information for sector leaders,
                      advocates, researchers, and practitioners. Our goal is to
                      make this information more accessible to and utilized by
                      the sector. We hope that this prototype will illustrate
                      the benefits of open, sharable and organized data, and
                      allow different stakeholders to better understand the
                      organizations that make up our sector and the activities
                      and programs they run.
                    </p>
                    {/* <p className="fw-bold">Where does the data come from?</p> */}
                    <p>
                      <span className="fw-bold">
                        Where does the data come from?
                      </span>
                      <br />
                      The data currently being used is publicly accessible and
                      comes from federal government sources. This is the data we
                      collected and its sources:
                      <ul>
                        <li className="fs-5">
                          <span className="fw-bold">Entities:</span> Information
                          about individual organizations in the nonprofit
                          sector. The data includes all organizations that are
                          registered with the CRA as a Public Foundation,
                          Private Foundation or Charitable Organization.{" "}
                          <a href="https://open.canada.ca/data/en/dataset/d4287672-3253-4bb8-84c7-4e515ea3fddf">
                            Source
                          </a>
                          .
                        </li>
                        <li className="fs-5">
                          <span className="fw-bold">Activities:</span> Grant
                          data from the federal Grants & Contributions database.
                          This data allows us to understand more about the
                          activities and programs carried out by organizations
                          in the nonprofit sector.{" "}
                          <a href="https://open.canada.ca/data/en/dataset/432527ab-7aac-45b5-81d6-7597107a7013/resource/1d15a62f-5656-49ad-8c88-f40ce689d831">
                            Source
                          </a>
                          .
                        </li>
                        <li className="fs-5">
                          <span className="fw-bold">Website Text:</span> The
                          corpus text of the organizations that had a listed
                          website URL with the CRA. The text was scrapped
                          directly from the organizations’ websites.
                        </li>
                      </ul>
                      We hope that a future version of the prototype will
                      contain private foundation grantmaking data to create a
                      better picture of the philanthropic landscape in Canada.
                    </p>
                    <p>
                      <span className="fw-bold">Can I access the data?</span>
                      <br />
                      The Hub’s data data has been normalized, aggregated, and
                      made available in a public{" "}
                      <a href="https://github.com/ajah/skshub-data">
                        Github repository
                      </a>{" "}
                      stored in 3 separate CSVs. You can also download the data
                      related to a search query directly from the interface by
                      clicking the download button found at the bottom of the
                      page.{" "}
                    </p>
                    <p>
                      <span className="fw-bold">
                        Where can I give feedback or suggest improvements?
                      </span>
                      <br />
                      The SKS Hub is a collaborative open project, and we
                      encourage anyone to give us feedback or suggestions on how
                      to make it better. If you would like to talk to us more
                      about this project, have any questions or would like to
                      discuss how to use the SKS Hub to help your work please{" "}
                      <a href="/contact">get in touch with us here.</a> We have
                      created a{" "}
                      <a href="https://github.com/ajah/skshub-data">
                        project on Github
                      </a>{" "}
                      where you can see the upcoming updates features and the
                      known bugs/issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
