import React, { useContext } from 'react'
import { SearchContext } from '../../context/search-context'
import { Link } from 'react-router-dom'

export default function BackButton() {
  const searchContext = useContext(SearchContext)
  return (
    <div>
      <Link
        className="btn btn-outline-primary"
        to={`/results?q=${searchContext.searchArray.join('+')}&filter=activity,entity`}
      >
        Back to Results
      </Link>
    </div>
  )
}
