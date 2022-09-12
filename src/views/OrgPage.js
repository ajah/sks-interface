import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { BackButton } from 'components/BackButton'
import { Get } from 'services/api'
import { fpeFormat, currencyFormat } from 'utils/format'

import './OrgPage.css'

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
)

export default class OrgPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      FPE: '',
      focus_area: '',
      legal_status: '',
      name: '',
      location_municipality: '',
      location_postal_code: '',
      legal_designation_type: '',
      location_region: '',
      location_country: '',
      revenue: '',
      employees: '',
      website: '',
      ent_sks_id: '',
      regulating_authority: '',
      revenue_currency: '',
      revenue_year: '',
      data_source: '',
      legal_status_date: '',
      record_type: '',
      loading: true,
      activities: [],
    }
  }

  async componentDidMount() {
    const url = new URL(window.location.href)
    const ent_sks_id = url.pathname.split('/')[2]

    await Get(`/entities/${ent_sks_id}`)
      .then((data) => {
        this.setState({
          FPE: data[0].FPE,
          focus_area: data[0].focus_area,
          legal_status: data[0].legal_status,
          name: data[0].name,
          location_municipality: data[0].location_municipality,
          location_postal_code: data[0].location_postal_code,
          legal_designation_type: data[0].legal_designation_type,
          location_region: data[0].location_region,
          location_country: data[0].location_country,
          revenue: data[0].revenue,
          employees: data[0].employees,
          website: data[0].website,
          ent_sks_id: data[0].ent_sks_id,
          regulating_authority: data[0].regulating_authority,
          revenue_currency: data[0].revenue_currency,
          revenue_year: data[0].revenue_year,
          data_source: data[0].data_source,
          legal_status_date: data[0].legal_status_date,
          record_type: data[0].record_type,
          external_id: data[0].external_id,
          loading: false,
        })
      })
      .catch((error) => console.log(error))

    this.getActivitiesData(ent_sks_id)
  }

  async getActivitiesData(ent_sks_id) {
    if (!ent_sks_id) {
      console.log('No entity was found')
      return
    }

    Get(`/activities/mostrecentbyent/${ent_sks_id}`)
      .then((activities) => {
        this.setState({
          activities,
        })
      })
      .catch((error) => console.log(error))
  }

  tableRows() {
    return this.state.activities.map((activity) => {
      return (
        <Row
          grant_title={activity.grant_title}
          funding_amount={activity.funding_amount}
          act_npk_id={activity.act_sks_id}
        />
      )
    })
  }

  getActivitesLength() {
    return this.state.activities.length
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
                    {(this.state.focus_area.includes('Charity provided description') ||
                      !this.state.focus_area) && <td>No data available</td>}
                    {this.state.focus_area &&
                      !this.state.focus_area.includes('Charity provided description') && (
                        <td>{this.state.focus_area}</td>
                      )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Website</strong>
                    </td>
                    {this.state.website ? (
                      <td>
                        <a
                          href={'http://'.concat(this.state.website)}
                          target="_blank"
                          rel={'noopener noreferrer'}
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
                      <td>{currencyFormat(this.state.revenue)}</td>
                    ) : (
                      <td>No data available</td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <strong>Fiscal Period (MM-DD)</strong>
                    </td>
                    {this.state.FPE ? (
                      <td>{fpeFormat(this.state.FPE)}</td>
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
                      <strong>Region</strong>
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
                        <th style={{ width: '35%' }} scope="col">
                          Funding Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>{this.tableRows()}</tbody>
                  </table>
                ) : (
                  'No activities associated with this organization'
                )}
                {this.state.activities.length >= 5 ? (
                  <Link to={`/grants/${this.state.ent_sks_id}`}>
                    <span> See a complete list of grants here</span>
                  </Link>
                ) : (
                  ''
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
                Associated links will appear in a later version, check back later.
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
    )
  }
}
