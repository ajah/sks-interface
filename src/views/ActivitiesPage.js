import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { BackButton } from 'components/BackButton'
import { Get } from 'services/api'
import { currencyFormat } from 'utils/format'

import './ActivitiesPage.css'

const NoOrgBox = (props) => (
  <div id="recipient_org">
    <h5>Recipient Organization</h5>
    <div className="border border-2 p-2">
      <div className="mb-1">
        No further information was found for this organization because this activity is
        not linked to an organization via a Business Number. Click the recipient
        organization link below to search the database for this organization by its legal
        name:
      </div>
      <Link
        to={`/search?q=${encodeURI(
          props.recip_legal_name.replace(/\s+/g, '+')
        )}&doctype=organization`}
      >
        {props.recip_legal_name}
      </Link>
    </div>
  </div>
)

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
              {props.recip_legal_name ? (
                <Link to={`/organizations/${props.org_redirect}`}>
                  props.recip_legal_name{' '}
                </Link>
              ) : (
                <span>Data not available</span>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Business Number</strong>
            </td>

            <td>{props.recip_business_number || <span>Data not available</span>}</td>
          </tr>
          <tr>
            <td>
              <strong>Designation Type</strong>
            </td>
            <td>{props.recip_designation_type || <span>Data not available</span>}</td>
          </tr>
          <tr>
            <td>
              <strong>Focus Area</strong>
            </td>
            <td>{props.recip_focus_area || <span>Data not available</span>}</td>
          </tr>
          <tr>
            <td>
              <strong>Website</strong>
            </td>
            <td>
              {props.recip_website ? (
                <a href={'http://'.concat(props.recip_website)}>{props.recip_website}</a>
              ) : (
                <span>Data not available</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)

const ExpectedResults = ({ expected_results }) => <p>{expected_results}</p>

const NoResults = () => <p>No expected results were found for this activity.</p>

export default class ActPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actual_results: '',
      date: '',
      date_type: '',
      end_date: '',
      end_date_type: '',
      expected_results: '',
      funder: '',
      funder_id: '',
      funding_amount: '',
      funding_type: '',
      grant_description: '',
      grant_municipality: '',
      grant_region: '',
      grant_title: '',
      npk_id: '',
      program_name: '',
      recipient_id: 0,
      recipient_organization: '',
      source_authority: '',
      source_id: '',
      source_url: '',
      loading: true,
      org_redirect: '',
      recip_legal_name: '',
      recip_business_number: '',
      recip_designation_type: '',
      recip_focus_area: '',
      recip_website: '',
    }
  }

  async componentDidMount() {
    const url = new URL(window.location.href)
    const npk_id = url.pathname.split('/')[2]

    await Get(`/activities/${npk_id}`)
      .then((data) => {
        if (!data[0]) return

        this.setState({
          date: data[0].date,
          date_type: data[0].date_type,
          end_date: data[0].end_date,
          end_date_type: data[0].end_date_type,
          expected_lts: data[0].expected_lts,
          funder: data[0].funder,
          funder_id: data[0].funder_id,
          funding_amount: data[0].funding_amount,
          funding_type: data[0].funding_type,
          grant_description: data[0].grant_description,
          grant_municipality: data[0].grant_municipality,
          grant_region: data[0].grant_region,
          grant_title: data[0].grant_title,
          npk_id: data[0].npk_id,
          program_name: data[0].program_name,
          recipient_id: data[0].recipient_id,
          recipient_organization: data[0].recipient_organization,
          source_authority: data[0].source_authority,
          source_id: data[0].source_id,
          source_url: data[0].source_url,
          org_redirect: data[0].ent_sks_id,
        })
      })
      .catch((error) => console.log(error))
      .finally(() => this.setState({ loading: false }))

    this.getEntitiesData()
  }

  getEntitiesData() {
    if (!this.state.org_redirect) {
      console.log('No entity was found')
      return
    }

    Get(`/entities/${this.state.org_redirect}`)
      .then((data) => {
        if (!data[0]) return

        this.setState({
          recip_legal_name: data[0].name,
          recip_business_number: data[0].external_id,
          recip_designation_type: data[0].legal_designation_type,
          recip_focus_area: data[0].focus_area,
          recip_website: data[0].website,
        })
      })
      .catch((error) => console.log(error))
  }

  render() {
    const { loading } = this.state
    if (loading) {
      return (
        <div className="container bg-light border border-2 mt-5 p-5 gap-2">
          <div className="row">
            <div className="pb-3">
              <div className="card-body shadow-lg p-5 m-5 text-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <div className="text-center">
                  Results may take up to 10 seconds to load
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    let recipientBox
    const hasOrg = this.state.org_redirect

    if (hasOrg) {
      recipientBox = (
        <RecipientOrgBox
          recip_legal_name={this.state.recip_legal_name}
          recip_business_number={this.state.recip_business_number}
          recip_designation_type={this.state.recip_designation_type}
          recip_focus_area={this.state.recip_focus_area}
          recip_website={this.state.recip_website}
          org_redirect={this.state.org_redirect}
        />
      )
    } else {
      recipientBox = <NoOrgBox recip_legal_name={this.state.recipient_organization} />
    }

    let expectedResults
    const hasResults = this.state.expected_results
    if (hasResults | (hasResults !== undefined)) {
      expectedResults = <ExpectedResults expected_results={this.state.expected_results} />
    } else {
      expectedResults = <NoResults />
    }

    return (
      <div className="container bg-light mt-5 mb-4 p-5 gap-2">
        <div className="row">
          <BackButton />
          <div className="mt-4 pb-3">
            <h2 className="text-center">{this.state.grant_title}</h2>
            <p className="text-center">
              {this.state.grant_description || (
                <span>Activity description not available</span>
              )}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div>
              <h5>Grant Information</h5>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: '35%' }} className="pr-4">
                      <strong>{this.state.funding_type}</strong>
                    </td>
                    <td>{currencyFormat(this.state.funding_amount)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Program Name</strong>
                    </td>
                    <td>{this.state.program_name || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{this.state.date_type}</strong>
                    </td>
                    <td>{this.state.date || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>{this.state.end_date_type}</strong>
                    </td>
                    <td>{this.state.end_date || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{this.state.grant_municipality || <td>No data available</td>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Region</strong>
                    </td>
                    <td>{this.state.grant_region || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source ID</strong>
                    </td>
                    <td>{this.state.source_id || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source Authority</strong>
                    </td>
                    <td>
                      {this.state.source_authority || <span>No data available</span>}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Source URL</strong>
                    </td>
                    <td>
                      <a
                        // href={this.state.source_url}
                        href="https://open.canada.ca/data/en/dataset/432527ab-7aac-45b5-81d6-7597107a7013"
                        // className="btn btn-outline-primary"
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
                      {' '}
                      {this.state.recip_legal_name ? (
                        <Link to={`/organizations/${this.state.org_redirect}`}>
                          {this.state.recip_legal_name}
                        </Link>
                      ) : (
                        <div>
                          <div className="search-warn"></div>
                          <div>{this.state.recipient_organization}</div>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Recipient ID</strong>
                    </td>
                    <td>{this.state.recipient_id || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Funder</strong>
                    </td>
                    <td>{this.state.funder || <span>No data available</span>}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Funder ID</strong>
                    </td>
                    <td>{this.state.funder_id || <span>No data available</span>}</td>
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
                <strong>Expected Results: </strong>
                {this.state.expected_results ? (
                  expectedResults
                ) : (
                  <span>No data available yet</span>
                )}
              </div>
              <div>
                <strong>Actual Results: </strong>
                <span>No data available yet</span>
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
    )
  }
}
