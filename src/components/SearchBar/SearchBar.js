import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'

import { SearchContext } from 'context/search-context'

import './SearchBar.css'

const SearchBar = () => {
  const history = useHistory()

  const searchContext = useContext(SearchContext)

  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchQuery1, setSearchQuery1] = React.useState('')
  const [searchQuery2, setSearchQuery2] = React.useState('')
  const [searchQuery3, setSearchQuery3] = React.useState('')
  const [searchQuery4, setSearchQuery4] = React.useState('')
  const [searchQuery5, setSearchQuery5] = React.useState('')

  let counter = 0

  const searchQueryHandler = (e) => {
    //e.preventDefault();

    searchContext.loadingHandler('true')

    /*   if (props.isHome) {

      e.preventDefault();

    } */

    if (
      searchQuery &&
      searchQuery1 !== searchQuery2 /* && (searchQuery2 !== searchQuery3) */
    ) {
      searchContext.searchHandler(searchQuery)

      if (counter === 0) {
        searchContext.searchArrayHandler(searchQuery1)
        counter++
      }
      if (counter === 1 && searchQuery1 !== searchQuery2 && searchQuery2) {
        searchContext.searchArrayHandler(searchQuery2)
        counter++
      }
      if (counter === 2 && searchQuery2 !== searchQuery3 && searchQuery3) {
        searchContext.searchArrayHandler(searchQuery3)
        counter++
      }
    }
    if (counter === 3 && searchQuery3 !== searchQuery4 && searchQuery4) {
      searchContext.searchArrayHandler(searchQuery4)
      counter++
    }
    if (counter === 4 && searchQuery4 !== searchQuery5 && searchQuery5) {
      searchContext.searchArrayHandler(searchQuery5)
      counter++
    }

    setSearchQuery('')
  }

  const enterHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setCurrentQuery(e)
      history.push(`/results?q=${e.target.value}&doctype=activity,entity`)
    }
  }

  const setCurrentQuery = (e) => {
    e.preventDefault()

    let query = e.target.value

    setSearchQuery(query)

    if (counter === 0) {
      setSearchQuery1(query)
    } else if (counter === 1) {
      setSearchQuery2(query)
    } else if (counter === 2) {
      setSearchQuery3(query)
    } else if (counter === 3) {
      setSearchQuery4(query)
    } else if (counter === 4) {
      setSearchQuery5(query)
    }

    //handleTotalQuery(query)
  }

  /*  const handleTotalQuery = (query) => {
  
    if (searchQuery1 && searchQuery2 && searchQuery3 && searchQuery4 && searchQuery5) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+searchQuery3+'+'+searchQuery4+'+'+query)
  
    }
  
    else if (searchQuery1 && searchQuery2 && searchQuery3 && searchQuery4) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+searchQuery3+'+'+query)
  
    }
  
    else if (searchQuery1 && searchQuery2 && searchQuery3) {
      setTotalQuery(searchQuery1+'+'+searchQuery2+'+'+query)
  
    }
    else if (searchQuery1 && searchQuery2) {
      setTotalQuery(searchQuery1+'+'+query)
    }
    else {
      setTotalQuery(query)
    } 
  
    
   }
   */
  const removeQuery = (query) => {
    searchContext.loadingHandler('true')

    /* const newArray = searchArray.splice(key, 1)
    setSearchArray(newArray) */

    if (searchQuery1 === query.query) {
      setSearchQuery1('')
    } else if (searchQuery2 === query.query) {
      setSearchQuery2('')
    } else if (searchQuery3 === query.query) {
      setSearchQuery3('')
    }

    searchContext.searchArray.splice(query.key, 1)

    if (!searchContext.searchArray) {
      setSearchQuery('')
    }

    //handleTotalQuery(query)

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
             `/results?q=${encodeURI(this.state.query)}&filter=activity,entity`
           );
           this.props.history.push({
             pathname: '/results',
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

  const orCheckHandler = async (e) => {
    await searchContext.orHandler(e.target.checked)
  }

  return (
    <div className="container pb-3 pt-1 mt-1">
      <form className="" onSubmit={searchQueryHandler}>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-5 inter-bar">
            {searchContext.searchArray.map((query, i) => {
              return (
                // TODO: Replace i with data relevant id
                <div className="search-query border col-2 ps-3 rounded-pill" key={i}>
                  {query}
                  {/*  <Link  to={`/results?q=${totalQuery.replace(('+'+query),"")}&filter=activity,entity`}>
                  <FontAwesomeIcon transform="right-15" onClick={() => removeQuery({query})} icon={faTimesCircle} />
                  </Link> */}
                  <div className="mx-auto" size="sm">
                    <FontAwesomeIcon
                      className="remove-query"
                      onClick={() => removeQuery({ query, key: i })}
                      icon={faTimesCircle}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="row">
          <div className="col-2 ">
            <h2 className="text-end">Search</h2>
          </div>

          <div className="col-7 ">
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
          <div className="col-3">
            <div className="inter-bar">
              <div className="mt-2 or-box">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="defaultCheck1"
                  name="entity"
                  onChange={(e) => orCheckHandler(e)}
                />
                <label className="form-check-label">'Or'</label>
              </div>

              <div className="">
                {searchContext.orFunctionality ? (
                  <Link
                    className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                    onClick={searchQueryHandler}
                    to={`/results?q=${searchContext.searchArray.join(
                      '$'
                    )}&doctype=activity,entity&operator=Or`}
                  >
                    Or Search <FontAwesomeIcon icon={faSearch} />
                  </Link>
                ) : (
                  <Link
                    className="btn btn-primary ps-4 pe-4 rounded-pill mx-auto"
                    onClick={searchQueryHandler}
                    to={`/results?q=${searchContext.searchArray.join(
                      '+'
                    )}&doctype=activity,entity&operator=And`}
                  >
                    And Search
                    <FontAwesomeIcon icon={faSearch} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
