import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./actPage.css";
import BackButton from "./common/BackButton";

const NoOrgBox = () => (
  <div id="recipient_org">
    <h5>Recipient Organization</h5>
    <div className="border border-2 p-2">
      No further information was found for this organization.
    </div>
  </div>
);
const RecipientOrgBox = (props) => (
  <div id="recipient_org">
    <h5>Recipient Organization</h5>
    <div className="border border-2 p-2">
      <table>
        <tbody>
          <tr>
            <td>
              <strong>Legal Name</strong>
            </td>
            <td>
              <a
                href={`http://0.0.0.0:3000/entities/${props.org_redirect}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.recip_legal_name}
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <strong>Business Number</strong>
            </td>
            <td>{props.recip_business_number}</td>
          </tr>
          <tr>
            <td>
              <strong>Designation Type</strong>
            </td>
            <td>{props.recip_designation_type}</td>
          </tr>
          <tr>
            <td>
              <strong>Focus Area</strong>
            </td>
            <td>{props.recip_focus_area}</td>
          </tr>
          <tr>
            <td>
              <strong>Website</strong>
            </td>
            <td>
              <a href={props.recip_website}>{props.recip_website}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const ExpectedResults = (props) => <p>{props.expected_results}</p>;

const NoResults = () => (
  <p>No expected results were found for this activity.</p>
);

export default class ActPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actual_results: "",
      date: "",
      date_type: "",
      end_date: "",
      end_date_type: "",
      expected_results: "",
      funder: "",
      funder_id: "",
      funding_amount: "",
      funding_type: "",
      grant_description: "",
      grant_municipality: "",
      grant_region: "",
      grant_title: "",
      npk_id: "",
      program_name: "",
      recipient_id: 0,
      recipient_organization: "",
      source_authority: "",
      source_id: "",
      source_url: "",
      loading: true,
      org_redirect: "",
      recip_legal_name: "",
    };
  }

  currencyFormat(amount) {
    return (
      "$" +
      Number.parseFloat(amount)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }

  fpeFormat(fpe) {
    return fpe.substring(5);
  }

  formatDatapoints(datapoint) {
    let result = "";
    if (datapoint == null) {
      result = "Unavailable";
    } else result = datapoint;

    return result;
  }

  async componentDidMount() {
    const url = new URL(window.location.href);
    const npk_id = url.pathname.split("/")[2];
    await axios
      // .get(`http://localhost:5000/activities/${npk_id}`)
      .get(`https://sks-server-hbl9d.ondigitalocean.app/activities/${npk_id}`)
      .then((res) => {
        this.setState({
          date: res["data"][0]["date"],
          date_type: res["data"][0]["date_type"],
          end_date: res["data"][0]["end_date"],
          end_date_type: res["data"][0]["end_date_type"],
          expected_results: res["data"][0]["expected_results"],
          funder: res["data"][0]["funder"],
          funder_id: res["data"][0]["funder_id"],
          funding_amount: res["data"][0]["funding_amount"],
          funding_type: res["data"][0]["funding_type"],
          grant_description: res["data"][0]["grant_description"],
          grant_municipality: res["data"][0]["grant_municipality"],
          grant_region: res["data"][0]["grant_region"],
          grant_title: res["data"][0]["grant_title"],
          npk_id: res["data"][0]["npk_id"],
          program_name: res["data"][0]["program_name"],
          recipient_id: res["data"][0]["recipient_id"],
          recipient_organization: res["data"][0]["recipient_organization"],
          source_authority: res["data"][0]["source_authority"],
          source_id: res["data"][0]["source_id"],
          source_url: res["data"][0]["source_url"],
          loading: false,
          org_redirect: res["data"][0]["ent_npk_id"],
        });
      })
      .catch((error) => console.log(error));

    this.getEntitiesData();
  }

  async getEntitiesData() {
    if (this.state.org_redirect !== undefined) {
      // const url = `http://localhost:5000/entities/${this.state.org_redirect}`;
      const url = `https://sks-server-hbl9d.ondigitalocean.app/entities/${this.state.org_redirect}`;
      await axios
        .get(url)
        .then((res) => {
          this.setState({
            recip_legal_name: res["data"][0]["name"],
            recip_business_number: res["data"][0]["BN"],
            recip_designation_type: res["data"][0]["legal_designation_type"],
            recip_focus_area: res["data"][0]["focus_area"],
            recip_website: res["data"][0]["website"],
          });
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No entity was found");
    }
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div className="container bg-light border border-2 mt-5 p-5 gap-2">
          <div className="row">
            <div className="pb-3">
              <div className="card-body shadow-lg p-5 m-5 text-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div className="text-center">
                  Results may take up to 10 seconds to load
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    let recipientBox;
    const hasOrg = this.state.recip_business_number;
    if (hasOrg) {
      recipientBox = (
        <RecipientOrgBox
          recip_legal_name={this.state.recip_legal_name}
          recip_business_number={this.state.recip_business_number}
          recip_designation_type={this.state.legal_designation_type}
          recip_focus_area={this.state.focus_area}
          recip_website={this.state.website}
          org_redirect={this.state.org_redirect}
        />
      );
    } else {
      recipientBox = <NoOrgBox />;
    }

    let expectedResults;
    const hasResults = this.state.expected_results;
    if (hasResults | (hasResults !== undefined)) {
      expectedResults = (
        <ExpectedResults expected_results={this.state.expected_results} />
      );
    } else {
      expectedResults = <NoResults />;
    }

    return (
      <div className="container bg-light mt-5 p-5 gap-2">
        <div className="row">
          <BackButton />
          <div className="pb-3">
            <h2 className="text-center">{this.state.grant_title}</h2>
            <p className="text-center">{this.state.grant_description}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>
              <h5>Grant Information</h5>
              <table>
                <tbody>
                  <tr>
                    <td className="pr-4">
                      <strong>{this.state.funding_type}</strong>
                    </td>
                    <td>{this.currencyFormat(this.state.funding_amount)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Program Name</strong>
                    </td>
                    <td>{this.state.program_name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{this.state.date_type}</strong>
                    </td>
                    <td>{this.state.date}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{this.state.end_date_type}</strong>
                    </td>
                    <td>{this.state.end_date}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{this.state.grant_municipality}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Province</strong>
                    </td>
                    <td>{this.state.grant_region}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source ID</strong>
                    </td>
                    <td>{this.state.source_id}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source Authority</strong>
                    </td>
                    <td>{this.state.source_authority}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source URL</strong>
                    </td>
                    <td>
                      <a
                        // href={this.state.source_url}
                        href="https://open.canada.ca/data/en/dataset/432527ab-7aac-45b5-81d6-7597107a7013"
                        // class="btn btn-outline-primary"
                        // role="button"
                      >
                        {/* Download Source */}
                        Click here to go to source
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <div>
              <h5>Recipient & Funder Organization</h5>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>Recipient Organization</strong>
                    </td>
                    <td>
                      {" "}
                      <Link
                        to={`/results/?q=${encodeURI(
                          this.state.recipient_organization
                        )}&filter=entity`}
                      >
                        {this.state.recipient_organization}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Recipient ID</strong>
                    </td>
                    <td>Not available</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Funder</strong>
                    </td>
                    <td>{this.state.funder}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Funder ID</strong>
                    </td>
                    <td>Not available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col">
            {recipientBox}
            <br />
            <h5>Activity Results</h5>
            <div className="border border-2 p-2">
              <div>
                <strong>Expected Results:</strong>
                {expectedResults}
              </div>
              <div>
                <strong>Actual Results:</strong>
                <p>Not available yet.</p>
              </div>
            </div>
            <br />
            <div>
              <h5>Documents related to this organization</h5>
              <div className="border border-2 p-2">
                Documents will appear in a later version, check back later.
                {/* <table>
                  <tbody>
                    <tr>
                      <td>
                        <GrDocument /> Documents will appear o 
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <GrDocument /> Doc 2
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <GrDocument /> Doc 3
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}
