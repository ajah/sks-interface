import React, { Component } from "react";
import axios from "axios";
import "./orgPage.css";
import BackButton from "./common/BackButton";
import { Link } from "react-router-dom";

// const url = new URL(window.location.href);
// const ent_npk_id = url.pathname.split("/")[2];

function currencyFormat(amount) {
  return (
    "$" +
    Number.parseFloat(amount)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  );
}

const Row = (props) => (
  <tr>
    <td>
      <div className="">
        <Link to={`/activities/${props.act_npk_id}`}>{props.grant_title}</Link>
      </div>
    </td>
    <td>
      <div className="">{currencyFormat(props.funding_amount)}</div>
    </td>
  </tr>
);

export default class OrgPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FPE: "",
      focus_area: "",
      legal_status: "",
      name: "",
      location_municipality: "",
      location_postal_code: "",
      legal_designation_type: "",
      location_region: "",
      location_country: "",
      revenue: "",
      employees: "",
      website: "",
      ent_sks_id: "",
      regulating_authority: "",
      revenue_currency: "",
      revenue_year: "",
      data_source: "",
      legal_status_date: "",
      record_type: "",
      loading: true,
      activities: [],
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
    if (fpe !== undefined) {
      return fpe.substring(5);
    }
  }

  // formatDatapoints(datapoint) {
  //   let result = "";
  //   if (datapoint == null) {
  //     result = "Unavailable";
  //   } else result = datapoint;

  //   return result;
  // }

  async componentDidMount() {
    const url = new URL(window.location.href);
    const ent_sks_id = url.pathname.split("/")[2];

    await axios
      .get(
        `https://sks-server-ajah-ttwto.ondigitalocean.app/entities/${ent_sks_id}`
      )
      .then((response) => {
        this.setState({
          FPE: response["data"][0]["FPE"],
          focus_area: response["data"][0]["focus_area"],
          legal_status: response["data"][0]["legal_status"],
          name: response["data"][0]["name"],
          location_municipality: response["data"][0]["location_municipality"],
          location_postal_code: response["data"][0]["location_postal_code"],
          legal_designation_type: response["data"][0]["legal_designation_type"],
          location_region: response["data"][0]["location_region"],
          location_country: response["data"][0]["location_country"],
          revenue: response["data"][0]["revenue"],
          employees: response["data"][0]["employees"],
          website: response["data"][0]["website"],
          ent_sks_id: response["data"][0]["ent_sks_id"],
          regulating_authority: response["data"][0]["regulating_authority"],
          revenue_currency: response["data"][0]["revenue_currency"],
          revenue_year: response["data"][0]["revenue_year"],
          data_source: response["data"][0]["data_source"],
          legal_status_date: response["data"][0]["legal_status_date"],
          record_type: response["data"][0]["record_type"],
          external_id: response["data"][0]["external_id"],
          loading: false,
        });
      })
      .then(console.log(this.state))
      .catch((error) => console.log(error));

    this.getActivitiesData(ent_sks_id);
  }

  async getActivitiesData(ent_sks_id) {
    if (ent_sks_id) {
      const url = `https://sks-server-ajah-ttwto.ondigitalocean.app/activities/mostrecentbyent/${ent_sks_id}`;
      await axios
        .get(url)
        .then((res) => {
          this.setState({
            activities: res["data"],
          });
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No entity was found");
    }
  }

  tableRows() {
    return this.state.activities.map((activity) => {
      return (
        <Row
          grant_title={activity.grant_title}
          funding_amount={activity.funding_amount}
          act_npk_id={activity.act_sks_id}
        />
      );
    });
  }

  getActivitesLength() {
    return this.state.activities.length;
  }

  render() {
    return (
      <div className="container bg-light mt-5 p-5 gap-2">
        <div className="row">
          <BackButton />
          <div className="pb-3">
            <h2 className="text-center">{this.state.name}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>
              <h5>Organization Information</h5>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>Legal Name</strong>
                    </td>
                    <td>{this.state.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Business Number</strong>
                    </td>
                    {this.state.external_id ? (
                      <td>{this.state.external_id}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Designation Type</strong>
                    </td>
                    {this.state.legal_designation_type ? (
                      <td>{this.state.legal_designation_type}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Focus Area</strong>
                    </td>
                    {(this.state.focus_area.includes(
                      "Charity provided description"
                    ) ||
                      !this.state.focus_area) && <td>No data available</td>}
                    {this.state.focus_area &&
                      !this.state.focus_area.includes(
                        "Charity provided description"
                      ) && <td>{this.state.focus_area}</td>}
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    {this.state.website ? (
                      <td>
                        <a
                          href={"http://".concat(this.state.website)}
                          target="_blank"
                          rel={"noopener noreferrer"}
                        >
                          {this.state.website}
                        </a>
                      </td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Number of Employees</strong>
                    </td>
                    {this.state.employees ? (
                      <td>{Math.trunc(this.state.employees)}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>{this.state.revenue_year} Revenue</strong>
                    </td>
                    {this.state.revenue ? (
                      <td>{this.currencyFormat(this.state.revenue)}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Fiscal Period (MM-DD)</strong>
                    </td>
                    {this.state.FPE ? (
                      <td>{this.fpeFormat(this.state.FPE)}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <div>
              <h5>Location</h5>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{this.state.location_municipality}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Province</strong>
                    </td>
                    <td>{this.state.location_region}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Postal Code</strong>
                    </td>
                    <td>{this.state.location_postal_code}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Country</strong>
                    </td>
                    <td>{this.state.location_country}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col">
            <div>
              <h5>Activities this organization is involved in</h5>
              <div className="border border-2 p-2">
                {this.state.activities.length > 0 ? (
                  <table className="table">
                    <thead className="">
                      <tr>
                        <th scope="col">Grant Title</th>
                        <th style={{ width: "35%" }} scope="col">
                          Funding Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>{this.tableRows()}</tbody>
                  </table>
                ) : (
                  "No activities associated with this organization"
                )}
                {this.state.activities.length >= 5 ? (
                  <Link to={`/activitiesbyent/${this.state.ent_sks_id}`}>
                    <span> See a complete list of grants here</span>
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
            <br />
            <div>
              <h5>Documents related to this organization</h5>
              <div className="border border-2 p-2">
                Documents will appear in a later version, check back later.
                {/* <table>
                {/* <table>
                  <tbody>
                    <tr>
                      <td>
                        <GrDocument /> Doc 1
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
            <div>
              <h5>Associated Links</h5>
              <div className="border border-2 p-2">
                Associated links will appear in a later version, check back
                later.
                {/* <table>
                {/* <table>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Website:</strong>
                      </td>
                      <td>{this.state.website}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>T3010 Form:</strong>
                      </td>
                      <td>website URL for individual org T3010 form</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
