import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { castArray, without } from 'lodash'
import { useLocation } from 'react-router-dom'

import { SearchContext } from 'context/search-context'

import { AND, OR, DEFAULT_OPERATOR } from 'constants'
import { useSearchParams } from 'hooks'
import { maxQueryTermLength, maxQueryTerms } from 'utils/query'

import 'assets/css/forms.css'
import './SearchBar.css'

const SearchBar = () => {
  const { pathname } = useLocation()
  const searchContext = useContext(SearchContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const isOnSearchPage = pathname === '/search'
  const { q = [] } = searchParams
  const qArr = castArray(q).slice(0, maxQueryTerms)

  const [existingQueries, setExistingQueries] = useState(qArr)
  const [inputQuery, setInputQuery] = useState('')

  const enterHandler = (e) => {
    if (e.key !== 'Enter') return

    setCurrentQueryHandler(e)
  }

  const setCurrentQueryHandler = (e) => {
    e.preventDefault()

    const operatorIsSame =
      searchContext.searchOperator === searchParams.operator ||
      (searchContext.searchOperator === DEFAULT_OPERATOR && !searchParams.operator)

    const emptyQuery = !inputQuery.trim()

    if (emptyQuery && operatorIsSame) return

    // In case changed operator but did not type in query
    if (emptyQuery && existingQueries.length && isOnSearchPage) {
      return setSearchParams(
        { operator: searchContext.searchOperator },
        { requestedPathname: '/search' }
      )
    }

    setInputQuery('')

    // Clean trailing and inner extra spaces. Since comma is used as delimiter, remove it.
    const inputQueryTrim = inputQuery.trim().replace(/\s+/g, ' ').replace(/,+/g, '')

    const existingQueriesLC = existingQueries.map((query) => query.toLowerCase())
    if (existingQueriesLC.includes(inputQueryTrim.toLowerCase())) return

    const newExistingQueries = [...existingQueries, inputQueryTrim]
    setExistingQueries(newExistingQueries)
    setSearchParams(
      { q: newExistingQueries, operator: searchContext.searchOperator },
      { requestedPathname: '/search' }
    )
  }

  const removeQueryHandler = (key) => {
    const newExistingQueries = without(existingQueries, existingQueries[key])
    setExistingQueries(newExistingQueries)
    setSearchParams(
      { q: newExistingQueries, operator: searchContext.searchOperator },
      { requestedPathname: '/search' }
    )
  }

  return (
    <div className="container pb-3 pt-1 mt-1">
      <form>
        <div className="row mb-1">
          <div className="col-2"></div>
          <div className="col-5 inter-bar">
            {existingQueries.map((searchTerm, i) => (
              <div
                className="search-query border col-2 ps-3 rounded-pill"
                // Search terms should be unique
                key={searchTerm}
              >
                {searchTerm}
                <div className="ms-2 me-1" size="sm">
                  <FontAwesomeIcon
                    className="remove-query"
                    onClick={() => removeQueryHandler(i)}
                    icon={faTimesCircle}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <h2 className="text-end">Search</h2>
          </div>

          <div className="col-6 col-xl-7">
            <div className=""></div>
            <div className="form-text">
              <input
                contentEditable="true"
                className="form-control ps-4 pe-4 rounded-pill"
                type="text"
                name="search"
                placeholder={
                  existingQueries.length >= maxQueryTerms
                    ? 'Max search term limit reached'
                    : 'Enter search terms here'
                }
                value={inputQuery}
                data-toggle="tooltip"
                title={`To complete your search enter a keyword or phrase and hit the enter key or click the search button. Enter one keyword at a time. Your results will update automatically as more keywords are added. The maximum keywords you can search for is ${maxQueryTerms}.`}
                onInput={(e) =>
                  e.target.value.length < maxQueryTermLength &&
                  setInputQuery(e.target.value)
                }
                onKeyPress={enterHandler}
                disabled={existingQueries.length >= maxQueryTerms}
              ></input>
            </div>
          </div>
          <div className="col-4 col-xl-3">
            <div className="inter-bar">
              <div className="mt-2 form__radio">
                <input
                  className="form-check-input form__input"
                  type="radio"
                  id="and-operator-select"
                  name="operator-select"
                  checked={searchContext.searchOperator === AND}
                  onChange={() => searchContext.setOperatorHandler(AND)}
                />
                <label htmlFor="and-operator-select" className="form__radio-label">
                  And
                </label>
              </div>
              <div className="form__radio mt-2 ms-3 me-3">
                <input
                  className="form-check-input form__input"
                  type="radio"
                  id="or-operator-select"
                  name="operator-select"
                  checked={searchContext.searchOperator === OR}
                  onChange={() => searchContext.setOperatorHandler(OR)}
                />
                <label htmlFor="or-operator-select" className="form__radio-label">
                  Or
                </label>
              </div>

              <div>
                <button
                  className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                  onClick={setCurrentQueryHandler}
                >
                  Search <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
