import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { SearchBar } from 'components/SearchBar'
import { SearchContext } from 'context/search-context'
import { useSearchParams } from 'hooks'

import {
  allowedSearchParams,

  // Operators
  allowedOperators,
  defaultOperator,

  // Types
  ACTIVITY,
  ORGANIZATION,
  allowedDoctypes,
  defaultDoctype,

  // Other constants
  // provinces,
} from 'constants'

// TODO: move styles.css import into SearchPage.css
import 'assets/css/styles.css'
import './SearchPage.css'

const Badge = ({ type }) => {
  if (type === ACTIVITY) {
    return <span className="badge badge-primary">Activity</span>
  }

  if (type === ORGANIZATION) {
    return <span className="badge bg-primary">Organization</span>
  }

  return null
}

const Row = (props) => (
  <tr>
    <td>
      <div>
        <Link to={props.url}>{props.name}</Link>
      </div>
    </td>
    <td>
      <div>
        {props.municipality}
        {props.region ? `, ${props.region}` : ''}
      </div>
    </td>
    <td>
      <div>
        <Badge type={props.type} />
      </div>
    </td>
  </tr>
)

const TableRows = ({ results }) => {
  return results.map((hit) => {
    const { _id, _index, _source } = hit

    let name
    let municipality
    let region
    let type
    let url

    if (_index === 'new-activities') {
      name = _source.grant_title
      municipality = _source.grant_municipality
      region = _source.grant_region
      type = ACTIVITY
      url = `/activities/${_source.act_sks_id}`
    } else if (_index === 'entities') {
      name = _source.name
      municipality = _source.location_municipality
      region = _source.location_region
      type = ORGANIZATION
      url = `/organizations/${_source.ent_sks_id}`
    }
    return (
      <Row
        name={name}
        municipality={municipality}
        region={region}
        type={type}
        url={url}
        key={_id}
      />
    )
  })
}

const SearchPage = () => {
  const searchContext = useContext(SearchContext)

  const [searchParams, setSearchParams] = useSearchParams()
  const [resultsState, setResultsState] = useState({
    total: '',
    results: [],
    act_total: '',
    ent_total: '',
    inc_activities: true,
    inc_organizations: true,
    contextState: '',
    filter: [ACTIVITY, ORGANIZATION],
    globalQuery: '',
    queryProp: [],
    city: '',
    location: [],
    region: '',
    municipality: '',
    downloadData: '',
    operator: '',
    downloadLink: '',
  })

  const { q = '', operator = '', doctype = [] } = searchParams
  // Doctype can be either an array or a string, depending on the num
  const docTypeStr = doctype.toString()

  useEffect(() => {
    try {
      if (!q.trim()) {
        setSearchParams({}, { overwrite: true, replace: true })
        return
      }

      const hasInvalidSearchParams = Object.keys(searchParams).some(
        (paramName) => !allowedSearchParams.includes(paramName)
      )

      if (hasInvalidSearchParams) {
        setSearchParams({}, { replace: true })
        return
      }

      const parsedOperator = allowedOperators.includes(operator)
        ? operator
        : defaultOperator

      if (searchContext.searchOperator !== parsedOperator)
        searchContext.setOperatorHandler(parsedOperator)

      const doctypeArr = docTypeStr.split(',')
      const filteredDoctype = doctypeArr.filter((type) => allowedDoctypes.includes(type))
      const parsedDoctype = filteredDoctype.length ? filteredDoctype : defaultDoctype

      const changedParams =
        doctypeArr.length !== parsedDoctype.length || operator !== parsedOperator

      if (changedParams) {
        setSearchParams(
          { q, doctype: parsedDoctype, operator: parsedOperator },
          { overwrite: true }
        )

        return
      }

      // Backend uses 'entity' keyword to refer to 'organization'
      const doctypeForApi = parsedDoctype.map((type) =>
        type === ORGANIZATION ? 'entity' : type
      )
      // if (!searchContext.searchArray[0]) {
      //   let queryArray = (q || '').split(' ')

      //   if (queryArray[0]) {
      //     // queryArray.forEach((item) => searchContext.addQueryHandler(item))
      //   }
      // }

      // if (filter === 'entity') {
      //   // isRedirect = true
      //   filter = 'entity'

      //   setResultsState({
      //     ...resultsState,
      //     inc_activities: false,
      //     inc_organizations: true,
      //     filter: resultsState.filter.slice(1),
      //   })
      // }

      // if (searchContext.searchArray.length) {
      //   // query = searchContext.searchArray.join('+')
      // } else if (searchContext.searchArray[0]) {
      //   // query = searchContext.searchArray[0]
      // }

      // TODO: Move all api calls into api service
      Promise.all([
        axios.get(
          `https://sks-server-ajah-ttwto.ondigitalocean.app/search?q=${encodeURI(
            q
          )}&doctype=${doctypeForApi}&operator=${parsedOperator}&region=${
            resultsState.location
          }&municipality=${resultsState.municipality}`
        ),
        axios.get(
          `https://sks-server-ajah-ttwto.ondigitalocean.app/count?q=${encodeURI(
            q
          )}&operator=${operator}`
        ),
      ]).then(
        axios.spread((search, count) => {
          setResultsState((prevState) => ({
            ...prevState,
            results: search.data.hits,
            total: count.data['new-activities,entities'],
            act_total: count.data['new-activities'],
            ent_total: count.data['entities'],
          }))
          // searchContext.loadingHandler(false)
          // if (resultsState.location.length && resultsState.municipality) {
          //   window.history.pushState(
          //     'page2',
          //     'Title',
          //     `/search?q=${q}&doctype=${filter.toString()}&region=${
          //       resultsState.location
          //     }&municipality=${resultsState.municipality}&operator=${resultsState.operator}`
          //   )
          // } else if (resultsState.location.length && !resultsState.municipality) {
          //   window.history.pushState(
          //     'page2',
          //     'Title',
          //     `/search?q=${query}&doctype=${filter.toString()}&region=${
          //       resultsState.location
          //     }&operator=${resultsState.operator}`
          //   )
          // } else if (resultsState.municipality && !resultsState.location.length) {
          //   window.history.pushState(
          //     'page2',
          //     'Title',
          //     `/search?q=${query}&doctype=${filter.toString()}&municipality=${
          //       resultsState.municipality
          //     }&operator=${resultsState.operator}`
          //   )
          // } else {
          //   window.history.pushState(
          //     'page2',
          //     'Title',
          //     `/search?q=${query}&doctype=${filter.toString()}&operator=${
          //       resultsState.operator
          //     }`
          //   )
          // }
          // setResultsState({
          //   ...resultsState,
          //   globalQuery: queryString.parse(window.location.search).q,
          // })
          // if (resultsState.globalQuery !== undefined) {
          //   const url = `https://sks-server-ajah-ttwto.ondigitalocean.app/search?q=${
          //     resultsState.globalQuery
          //   }&doctype=${filter.toString()}&region=${resultsState.location}&municipality=${
          //     resultsState.municipality
          //   }&operator=${resultsState.operator}`
          //   axios
          //     .get(url)
          //     .then(() => {
          //       setResultsState({
          //         ...resultsState,
          //         downloadLink: `https://sks-server-ajah-ttwto.ondigitalocean.app//download?q=${
          //           resultsState.globalQuery
          //         }&doctype=${filter.toString()}&region=${
          //           resultsState.location
          //         }&municipality=${resultsState.municipality}&operator=${
          //           resultsState.operator
          //         }`,
          //       })
          //     })
          //     .catch((error) => console.log(error))
          // } else {
          //   console.log('No entity was found')
          // }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }, [docTypeStr, operator, q, resultsState.location, resultsState.municipality])

  // componentDidMount() {
  // const parsed = queryString.parse(this.props.location.search)

  /*  if (!filter.includes("activity")) {
       setResultsState({...resultsState, 
         inc_activities: false,
       });
     } else if (!filter.includes("entity")) {
       setResultsState({...resultsState, 
         inc_organizations: false,
       });
     } */
  // }

  // componentDidUpdate() {
  //   // Typical usage (don't forget to compare props):

  //   if (searchContext.loading) {
  //     this.componentDidMount()
  //   }
  // }

  const setCity = (e) => {
    setResultsState({ ...resultsState, city: e.target.value })
  }

  const searchCity = (e, city) => {
    e.preventDefault()

    city = resultsState.city

    setResultsState({ ...resultsState, municipality: city })

    if (resultsState.location) {
      window.history.pushState(
        'page2',
        'Title',
        `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
          ','
        )}&region=${resultsState.location}&municipality=${city}&operator=${
          resultsState.operator
        }`
      )
    } else {
      window.history.pushState(
        'page2',
        'Title',
        `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
          ','
        )}&municipality=${city}&operator=${resultsState.operator}`
      )
    }
  }

  const handleLocation = (e) => {
    //e.preventDefault();

    let loc

    loc = e.target.name

    if (!resultsState.location.includes(loc)) {
      resultsState.location.push(loc)

      setResultsState({ ...resultsState, location: resultsState.location })
    } else if (resultsState.location.includes(loc)) {
      const index = resultsState.location.indexOf(loc)

      resultsState.location.splice(index, 1)

      setResultsState({ ...resultsState, location: resultsState.location })
    }

    if (resultsState.municipality) {
      window.history.pushState(
        'page2',
        'Title',
        `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
          ','
        )}&region=${resultsState.location}&municipality=${
          resultsState.municipality
        }&operator=${resultsState.operator}`
      )
    } else {
      window.history.pushState(
        'page2',
        'Title',
        `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
          ','
        )}&region=${resultsState.location}&operator=${resultsState.operator}`
      )
    }
  }

  const handleDoctypeFilter = (e) => {
    const newDoctype = e.target.value
    setSearchParams({ doctype: newDoctype.split(',') })

    /* 

    const parsed = queryString.parse(this.props.location.search);
    const query =  searchContext.query;
    const filter = parsed.filter;
  


    axios
      .all([
        axios.get(
          `https://sks-server-hbl9d.ondigitalocean.app/search?q=${encodeURI(
            query
          )}&filter=${filter}`
        ),
        axios.get(
          `https://sks-server-hbl9d.ondigitalocean.app/count?q=${encodeURI(
            query
          )}`
        ),
      ])
      .then(
        axios.spread((search, count) => {
          setResultsState({...resultsState, 
            results: search["data"]["hits"],
            total: count["data"]["new-activities,entities"],
            act_total: count["data"]["new-activities"],
            ent_total: count["data"]["entities"],
          });
        })
      ); 
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;


    const queryParams = queryString.parse(window.location.search);
    const filters = resultsState.filter;

    if (value === true) {
      filters.push(name);
      setResultsState({...resultsState, 
        filter: filters,
      });
      //this.componentDidMount()
    }

    const index = filters.indexOf(name);

    setResultsState({...resultsState, 
      filter: filters,
    });

    if (index > -1) {
      filters.splice(index, 1); // 2nd parameter means remove one item only
      setResultsState({...resultsState, 
        filter: filters,
      });
    }

    this.componentDidMount();
    /*   setResultsState({...resultsState, 
        queryParams: filters,
      });
  
      setResultsState({...resultsState, 
        queryParams: name,
      }); */
  }

  // const handleDownload = () => {
  //   if (resultsState.globalQuery !== undefined) {
  //     const url = `https://sks-server-ajah-ttwto.ondigitalocean.app/search?q=${this.global.query}&doctype=activity,entity`
  //     axios
  //       .get(url)
  //       .then((res) => {
  //         setResultsState({ ...resultsState, downloadData: res.data.hits })
  //       })
  //       .catch((error) => console.log(error))
  //   } else {
  //     console.log('No entity was found')
  //   }
  // }

  const handleButton = (e) => {
    e.preventDefault()

    let filter = []
    // if (resultsState.inc_activities) {
    //   filter.push('activity')
    // } else if (resultsState.inc_organizations) {
    //   filter.push('entity')
    // } else if (!resultsState.inc_activities & !resultsState.inc_organizations) {
    //   filter.push('activity,entity') //.push("entity"); //
    // } else if (resultsState.inc_activities & resultsState.inc_organizations) {
    //   filter.push('activity,entity') //.push("entity"); //
    // }

    /*   const queryParams = queryString.parse(window.location.search);
      // const newQueries = { ...queryParams, filter: filter.toString() };
      const orig_q = queryParams["q"];
  
      const { history } = this.props;
  
      if (filter) {
        history.push(`/search?q=${orig_q}&filter=${filter.toString()}`);
        window.location.reload(false);
        setFilter(filter.toString)
      }
  
      history.push(`/search?q=${encodeURI(orig_q)}&filter=${filter.toString()}`);
      window.location.reload(false);*/
  }

  return (
    <main className="page projects-page mt-5">
      <div className="container ">
        <div className="row mt-5" id="SearchBar">
          <SearchBar queryProp={resultsState.queryProp} />
        </div>
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-2 border border-3">
            {/* <div className="col-2"> */}
            <div className="row">
              <div className="col">
                <h4 className="mt-3">Filter Your Search</h4>
                <div>
                  <form className="form--align-with-checkboxes">
                    <hr />
                    <div>
                      <input
                        className="form-check-input form__input"
                        type="radio"
                        checked={
                          doctype.includes('organization') && doctype.includes('activity')
                        }
                        id="all-type-select"
                        name="type-select"
                        value="organization,activity"
                        onChange={handleDoctypeFilter}
                      />
                      <label htmlFor="all-type-select" className="form__radio-label">
                        All Types
                      </label>
                    </div>
                    <div>
                      <input
                        className="form-check-input form__input"
                        type="radio"
                        checked={
                          doctype.includes('organization') &&
                          !doctype.includes('activity')
                        }
                        id="organization-type-select"
                        name="type-select"
                        value="organization"
                        onChange={handleDoctypeFilter}
                      />
                      <label
                        htmlFor="organization-type-select"
                        className="form__radio-label"
                      >
                        Organizations
                      </label>
                    </div>
                    <div>
                      <input
                        className="form-check-input form__input"
                        type="radio"
                        checked={
                          !doctype.includes('organization') &&
                          doctype.includes('activity')
                        }
                        id="activity-type-select"
                        name="type-select"
                        value="activity"
                        onChange={handleDoctypeFilter}
                      />
                      <label htmlFor="activity-type-select" className="form__radio-label">
                        Activities
                      </label>
                    </div>
                  </form>
                  {/* <form>
                    <hr />
                    // {provinces.map((province) => {
                      return (
                        <div className="form-check" key={province}>
                          <input
                            className="form-check-input form__input"
                            type="checkbox"
                            checked={resultsState.location.includes(province)}
                            id="defaultCheck1"
                            name={province}
                            onChange={handleLocation}
                          />
                          <label className="form-check-label">{province}</label>
                        </div>
                      )
                    })}

                    <div className="mt-4">
                      <label className="form-check-label">City:</label>

                      <div className="city-block">
                        <input
                          className="form-control rounded-pill"
                          type="text"
                          name={resultsState.city}
                          onChange={(e) => setCity(e)}
                        />
                        <div>
                          <button
                            className="ms-2 btn btn-primary"
                            onClick={(e) => searchCity(e)}
                          >
                            <FontAwesomeIcon
                              className="d-inline"
                              size="sm"
                              icon={faSearch}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form> */}
                  <hr />
                  <p className="text-secondary">More filters coming soon!</p>
                </div>
                {/* <div className="">
                  <button className="btn btn-primary" onClick={handleButton}>
                    Update
                  </button>
                </div> */}
              </div>
              {/* <div className="row mt-4">
                  <div className="col">
                    <h4>Terms</h4>
                    <div className="mt-3" id="FFBC">
                      <strong>
                        <GoTriangleDown />
                        {"   "}FFBC
                      </strong>
                      <div className="form-check mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck1"
                        />
                        <label className="form-check-label" for="defaultCheck1">
                          Black-Led
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label className="form-check-label" for="defaultCheck2">
                          Black-Serving
                        </label>
                      </div>
                    </div>
                    <div className="mt-3" id="EFC">
                      <strong>
                        <GoTriangleDown />
                        {"   "}EFC
                      </strong>
                      <div className="form-check mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck1"
                        />
                        <label className="form-check-label" for="defaultCheck1">
                          Sustainability
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label className="form-check-label" for="defaultCheck2">
                          Climate Change
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label className="form-check-label" for="defaultCheck2">
                          Climate Education
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label className="form-check-label" for="defaultCheck2">
                          Water & Oceans
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="defaultCheck2"
                        />
                        <label className="form-check-label" for="defaultCheck2">
                          Renewable Energy
                        </label>
                      </div>
                    </div>
                    <div className="p-2">
                      <button className="btn btn-primary">Update</button>
                    </div>
                  </div>
                </div> */}
            </div>
          </div>

          {/* SEARCH RESULTS */}
          <div className="col-10">
            <div className="p-3">
              <div className="row ">
                <div className="col">
                  <div className="bg-light p-3">
                    <span>Total Results: </span>
                    <span className="badge rounded-pill bg-primary ms-2">
                      {resultsState.total}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="bg-light p-3">
                    <span>Organizations: </span>
                    <span className="badge rounded-pill bg-secondary ms-2">
                      {resultsState.ent_total}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="bg-light p-3">
                    <span>Activities: </span>
                    <span className="badge rounded-pill bg-secondary ms-2">
                      {resultsState.act_total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="row" id="searchResults">
                <div className="col">
                  <div className="mt-2">
                    <h4>Search Results</h4>
                  </div>
                  {resultsState.globalQuery && (
                    <a href={resultsState.downloadLink}>Download Results</a>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  {/* <div>{this.tableRows()}</div> */}
                  <table className="table table-striped">
                    <thead className="thead-light">
                      <tr>
                        <th style={{ width: '55%' }} scope="col">
                          Name
                        </th>
                        <th scope="col">Location</th>
                        <th scope="col">Record Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRows results={resultsState.results} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SearchPage
