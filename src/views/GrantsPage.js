import React, { Component } from 'react'

import { BackToEntButton } from 'components/BackButton'
import { Get } from 'services/api'
import { currencyFormat } from 'utils/format'

import './GrantsPage.css'

const Row = (props) => (
  <tr>
    <td>
      <div className="">{props.date}</div>
    </td>
    <td>
      <div className="">
        <a
          href={`/activities/${props.act_sks_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.grant_title}
        </a>
      </div>
    </td>
    <td>
      <div className="">{currencyFormat(props.funding_amount)}</div>
    </td>
    <td>
      <div className="">{props.grant_description}</div>
    </td>
  </tr>
)

export default class GrantsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activities: [],
    }
  }

  componentDidMount() {
    const url = new URL(window.location.href)
    const ent_sks_id = url.pathname.split('/')[2]

    Get(`/activities/byentity/${ent_sks_id}`)
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
          act_sks_id={activity.act_sks_id}
          grant_description={activity.grant_description}
          date={activity.date}
        />
      )
    })
  }

  render() {
    return (
      <div className="container bg-light  mt-5 p-5 gap-2">
        <div className="row">
          <div className="pb-3 text-center">
            <h2 className="">Complete list of grants for organization</h2>
            <BackToEntButton />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="p-2">
              <table className="table">
                <thead className="">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Grant Title</th>
                    <th scope="col">Funding Amount</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>{this.tableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
