import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { SearchContext } from 'context/search-context'

export default function BackButton() {
  const searchContext = useContext(SearchContext)
  const { state } = useLocation()

  return (
    <div>
      <Link className="btn btn-outline-primary" to={state?.from || `/search`}>
        Back to Results
      </Link>
    </div>
  )
}
