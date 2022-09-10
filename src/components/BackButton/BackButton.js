import { Link, useLocation } from 'react-router-dom'

const BackButton = () => {
  const { state } = useLocation()

  return (
    <div>
      <Link className="btn btn-outline-primary" to={state?.from || `/search`}>
        Back to results
      </Link>
    </div>
  )
}

export default BackButton
