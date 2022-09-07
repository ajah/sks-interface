import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { SearchContext } from 'context/search-context'

export default function BackButton() {
  const searchContext = useContext(SearchContext)
  return (
    <div>
      <Link
        className="btn btn-outline-primary"
        to={`/search?q=${searchContext.searchArray.join(
          '+'
        )}&doctype=activity,organization`}
      >
        Back to Results
      </Link>
    </div>
  )
}
