import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { BackButton } from 'components/BackButton'
import { useMountEffect } from 'hooks'
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

const TableRows = ({ activities }) =>
  activities.map((activity) => (
    <Row
      grant_title={activity.grant_title}
      funding_amount={activity.funding_amount}
      act_sks_id={activity.act_sks_id}
      grant_description={activity.grant_description}
      date={activity.date}
    />
  ))

const GrantsPage = () => {
  const { id } = useParams()
  const [activities, setActivities] = useState([])

  useMountEffect(() => {
    Get(`/activities/byentity/${id}`)
      .then((activities) => setActivities(activities))
      .catch((error) => console.log(error))
  })

  return (
    <div className="container bg-light  mt-5 p-5 gap-2">
      <div className="row">
        <div className="pb-3 text-center">
          <h2 className="">Complete list of grants for organization</h2>
          <BackButton to={`/organizations/${id}`} label="Back to Organization" />
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
              <tbody>
                <TableRows activities={activities} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrantsPage
