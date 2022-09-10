import { Link, useLocation } from 'react-router-dom'

const BackButton = ({ to, label }) => {
  const { state } = useLocation()

  return (
    <div>
      <Link className="btn btn-outline-primary" to={state?.from || to}>
        {label}
      </Link>
    </div>
  )
}

BackButton.defaultProps = {
  label: 'Back to results',
  to: '/search',
}

export default BackButton
