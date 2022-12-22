import { Link, useLocation } from 'react-router-dom'

import { Badge } from 'components/Badge'

import { ACTIVITY, ORGANIZATION } from 'constants'

const TableRows = ({ results }) => {
  const location = useLocation()

  return results.map(({ _id, _index, _source }) => {
    let name
    let city
    let region
    let type
    let url

    if (_index === 'new-activities') {
      name = _source.grant_title
      city = _source.grant_municipality
      region = _source.grant_region
      type = ACTIVITY
      url = `/activities/${_source.act_sks_id}`
    }

    if (_index === 'entities') {
      name = _source.name
      city = _source.location_municipality
      region = _source.location_region
      type = ORGANIZATION
      url = `/organizations/${_source.ent_sks_id}`
    }

    return (
      <Row
        key={_id}
        location={location}
        name={name}
        city={city}
        region={region}
        type={type}
        url={url}
      />
    )
  })
}

const Row = (props) => (
  <tr>
    <td>
      <div>
        <Link
          to={props.url}
          state={{ from: `${props.location.pathname}${props.location.search}` }}
        >
          {props.name}
        </Link>
      </div>
    </td>
    <td>
      <div>
        {props.city}
        {props.region ? `, ${props.region}` : ''}
      </div>
    </td>
    <td>
      <div>
        <Badge type={props.type} />
      </div>
    </td>
  </tr>
)

export default TableRows
