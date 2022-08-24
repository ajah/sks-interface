import React, { useContext } from 'react'
import { SearchContext } from '../../context/search-context'
import { Link } from 'react-router-dom'

export default function BackButton() {
  const searchContext = useContext(SearchContext)
  return (
    <div>
      {/*   <button className="btn btn-outline-primary" onClick={history.goBack}>
        Go Back to Results
      </button> */}
      <Link
        className="btn btn-outline-primary"
        to={`/results?q=${searchContext.searchArray.join('+')}&filter=activity,entity`}
      >
        Go Back to Results
      </Link>
    </div>
  )
}
