import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { SearchContext } from 'context/search-context'

import 'assets/css/forms.css'
import './SearchBar.css'

import { AND, OR } from 'constants'
import { useSearchParams } from 'hooks'
import { getQueryString } from 'utils/query'

const SearchBar = () => {
  const searchContext = useContext(SearchContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchQuery1, setSearchQuery1] = useState('')
  const [searchQuery2, setSearchQuery2] = useState('')
  const [searchQuery3, setSearchQuery3] = useState('')
  const [searchQuery4, setSearchQuery4] = useState('')
  const [searchQuery5, setSearchQuery5] = useState('')

  let counter = 0

  const searchQueryHandler = (e) => {
    //e.preventDefault();

    searchContext.loadingHandler(true)

    /*   if (props.isHome) {

      e.preventDefault();

    } */

    if (
      searchQuery &&
      searchQuery1 !== searchQuery2 /* && (searchQuery2 !== searchQuery3) */
    ) {
      searchContext.searchHandler(searchQuery)

      if (counter === 0) {
        searchContext.addQueryHandler(searchQuery1)
        counter++
      }
      if (counter === 1 && searchQuery1 !== searchQuery2 && searchQuery2) {
        searchContext.addQueryHandler(searchQuery2)
        counter++
      }
      if (counter === 2 && searchQuery2 !== searchQuery3 && searchQuery3) {
        searchContext.addQueryHandler(searchQuery3)
        counter++
      }
    }
    if (counter === 3 && searchQuery3 !== searchQuery4 && searchQuery4) {
      searchContext.addQueryHandler(searchQuery4)
      counter++
    }
    if (counter === 4 && searchQuery4 !== searchQuery5 && searchQuery5) {
      searchContext.addQueryHandler(searchQuery5)
      counter++
    }

    setSearchQuery('')
  }

  const enterHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setCurrentQuery(e)
      setSearchParams(
        { q: searchQuery.trim(), operator: searchContext.searchOperator },
        { requestedPathname: '/search' }
      )
    }
  }

  const setCurrentQuery = (e) => {
    e.preventDefault()
    const query = e.target.value
    setSearchQuery(query)

    // if (counter === 0) {
    //   setSearchQuery1(query)
    // } else if (counter === 1) {
    //   setSearchQuery2(query)
    // } else if (counter === 2) {
    //   setSearchQuery3(query)
    // } else if (counter === 3) {
    //   setSearchQuery4(query)
    // } else if (counter === 4) {
    //   setSearchQuery5(query)
    // }
  }

  const removeQuery = ({ key, query }) => {
    searchContext.loadingHandler(true)
    console.log({ key, query })

    if (searchQuery1 === query) {
      setSearchQuery1('')
    } else if (searchQuery2 === query) {
      setSearchQuery2('')
    } else if (searchQuery3 === query) {
      setSearchQuery3('')
    }

    searchContext.removeQueryHandler(query)

    // if (!searchContext.searchArray) {
    //   setSearchQuery('')
    // }

    counter--

    searchContext.searchHandler('')
  }

  /* 
    setCurrentQuery = (query) => {
      localStorage.setItem('query', query);
      this.setState({ currentQuery: query });
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      const { history } = this.props;
  
      if (this.state.query && this.state.query.length > 1) {
        this.getInfo();
           history.push(
             `/search?q=${encodeURI(this.state.query)}&filter=activity,entity`
           );
           this.props.history.push({
             pathname: '/search',
             search:  `q=${encodeURI(this.state.query)}&filter=activity,entity`,
             state: { detail: "test" }
           })
           window.location.reload(false);
      }
  
      if (this.state.query) {
        localStorage.setItem('query', this.state.query);
        this.setState({ currentQuery: this.state.query });
  
      }
  
  
    }; */

  const newSearchQuery = getQueryString({
    ...searchParams,
    q: searchQuery,
    operator: searchContext.searchOperator,
  })

  return (
    <div className="container pb-3 pt-1 mt-1">
      <form className="" onSubmit={searchQueryHandler}>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-5 inter-bar">
            {searchContext.searchArray.map((searchTerm, i) => {
              return (
                // TODO: Replace i with data relevant id
                <div className="search-query border col-2 ps-3 rounded-pill" key={i}>
                  {searchTerm}
                  {/*  <Link  to={`/search?q=${totalQuery.replace(('+'+query),"")}&filter=activity,entity`}>
                  <FontAwesomeIcon transform="right-15" onClick={() => removeQuery({query})} icon={faTimesCircle} />
                  </Link> */}
                  <div className="mx-auto" size="sm">
                    <FontAwesomeIcon
                      className="remove-query"
                      onClick={() => removeQuery({ query: searchTerm, key: i })}
                      icon={faTimesCircle}
                    />
                  </div>
                </div>
              )
            })}
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
                placeholder="Enter search terms here"
                value={searchQuery}
                data-toggle="tooltip"
                title="To complete your search enter a keyword or phrase and hit the enter key or click the search button. Enter one keyword at a time. Your results will update automatically as more keywords are added. The maximum keywords you can search for is 5."
                onInput={(e) => setCurrentQuery(e)}
                onKeyPress={(e) => enterHandler(e)}
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
                <Link
                  className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                  // onClick={searchQueryHandler}
                  to={`/search${newSearchQuery}`}
                >
                  Search <FontAwesomeIcon icon={faSearch} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
