import { ACTIVITY, ORGANIZATION } from 'constants'

const Badge = ({ type }) => {
  if (type === ACTIVITY) {
    return <span className="badge badge-primary">Activity</span>
  }

  if (type === ORGANIZATION) {
    return <span className="badge bg-primary">Organization</span>
  }

  return null
}

export default Badge
