import { useEffect, useState, useContext } from 'react'
import { isEqual, kebabCase, pick, toLower, without, uniq } from 'lodash'
import { Link, useLocation } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { SearchBar } from 'components/SearchBar'
import { SearchContext } from 'context/search-context'
import { useSearchParams } from 'hooks'
import { Get } from 'services/api'
import { maxQueryCities, maxQueryTermLength, maxQueryTerms } from 'utils/query'

import {
  allowedSearchParams,

  // Operators
  allowedOperators,
  DEFAULT_OPERATOR,

  // Types
  ACTIVITY,
  ORGANIZATION,
  allowedDoctypes,
  defaultDoctype,

  // Other constants
  regions,
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
        <Link
          to={props.url}
          state={{ from: `${props.location.pathname}${props.location.search}` }}
        >
          {props.name}
        </Link>
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
  const location = useLocation()

  return results.map(({ _id, _index, _source }) => {
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
    }

    if (_index === 'entities') {
      name = _source.name
      municipality = _source.location_municipality
      region = _source.location_region
      type = ORGANIZATION
      url = `/organizations/${_source.ent_sks_id}`
    }

    return (
      <Row
        key={_id}
        location={location}
        name={name}
        municipality={municipality}
        region={region}
        type={type}
        url={url}
      />
    )
  })
}

const initialResultsState = {
  // TODO: Review state vars below and see which are unnecessry
  total: '',
  results: [],
  actTotal: '',
  entTotal: '',
  incActivities: true,
  incOrganizations: true,
  globalQuery: '',
  municipality: '',
  downloadData: '',
  downloadLink: '',
  // city: '',
}

const SearchPage = () => {
  const searchContext = useContext(SearchContext)

  const [searchParams, setSearchParams] = useSearchParams()
  const [resultsState, setResultsState] = useState(initialResultsState)

  const { q = [], city = [], doctype = [], operator = '', region = [] } = searchParams

  // Params that can have multiple values separated by commas will be a string when one value is provided,
  // and an array when multiple values are provided
  const qStr = q.toString()
  const doctypeStr = doctype.toString()
  const regionStr = region.toString()
  const cityStr = city.toString()

  useEffect(() => {
    try {
      const searchParamNames = Object.keys(searchParams)
      const hasInvalidSearchParams = searchParamNames.some(
        (paramName) => !allowedSearchParams.includes(paramName)
      )

      if (hasInvalidSearchParams) {
        setSearchParams(
          { ...pick(searchParamNames, allowedSearchParams) },
          { replacePage: true }
        )
        return
      }

      // Check 'q'
      if (!qStr) return setResultsState(initialResultsState)
      const qArr = Array.isArray(q) ? q : [q]

      // Each query term should be limited to maxQueryTermLength chars
      // and there should be a max of maxQueryTerms query terms
      const parsedQArr = uniq(
        qArr.map((query) => query.slice(0, maxQueryTermLength))
      ).slice(0, maxQueryTerms)

      // Check 'operator'
      const parsedOperator = allowedOperators.includes(operator)
        ? operator
        : DEFAULT_OPERATOR

      if (searchContext.searchOperator !== parsedOperator)
        searchContext.setOperatorHandler(parsedOperator)

      // Check 'city'
      const cityArr = cityStr ? cityStr.split(',') : []
      const parsedCityArr = uniq(
        cityArr
          .map((aCity) => aCity.trim())
          .filter((aCity) => aCity.length < maxQueryTermLength)
      ).slice(0, maxQueryCities)

      // Check 'doctype'
      const doctypeArr = doctypeStr ? doctypeStr.split(',') : []
      const filteredDoctypeArr = uniq(doctypeArr).filter((type) =>
        allowedDoctypes.includes(type)
      )
      const parsedDoctypeArr = filteredDoctypeArr.length
        ? filteredDoctypeArr
        : defaultDoctype

      // Check 'region'
      const regionArr = regionStr ? regionStr.split(',') : []
      const parsedRegionArr = uniq(regionArr).filter((regionCode) =>
        regions.some(({ code }) => code === regionCode)
      )

      const changedParams =
        qStr.length !== parsedQArr.toString().length ||
        doctypeArr.length !== parsedDoctypeArr.length ||
        operator !== parsedOperator ||
        regionArr.length !== parsedRegionArr.length ||
        !isEqual(cityArr.map(toLower), parsedCityArr.map(toLower))

      if (changedParams) {
        setSearchParams(
          {
            q: parsedQArr,
            city: parsedCityArr,
            doctype: parsedDoctypeArr,
            operator: parsedOperator,
            region: parsedRegionArr,
          },
          { replaceParams: true }
        )

        return
      }

      Promise.all([
        Get('/search', {
          q: parsedQArr,
          doctype: parsedDoctypeArr,
          operator: parsedOperator,
          region: parsedRegionArr,
          city: parsedCityArr,
        }),
        Get('/count', { q: parsedQArr, operator: parsedOperator }),
      ]).then(
        ([search, count]) =>
          setResultsState((prevState) => ({
            ...prevState,
            results: search.hits,
            total: count['new-activities,entities'],
            actTotal: count['new-activities'],
            entTotal: count['entities'],
          }))

        // searchContext.isLoadingHandler(false)
      )
    } catch (error) {
      console.log('Query parsing error', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qStr, cityStr, doctypeStr, operator, regionStr])

  const handleRegionFilter = (e) => {
    const regionCode = e.target.name
    const regionArr = Array.isArray(region) ? region : [region]

    const adjustedRegion = regionArr.includes(regionCode)
      ? without(regionArr, regionCode)
      : [...regionArr, regionCode]

    setSearchParams({ region: adjustedRegion })
  }

  const handleDoctypeFilter = (e) => {
    const newDoctype = e.target.value
    setSearchParams({ doctype: newDoctype.split(',') })
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

  // const handleButton = (e) => {
  //   e.preventDefault()

  //   let filter = []
  // if (resultsState.incActivities) {
  //   filter.push(ACTIVITY)
  // } else if (resultsState.incOrganizations) {
  //   filter.push('entity')
  // } else if (!resultsState.incActivities & !resultsState.incOrganizations) {
  //   filter.push('activity,entity') //.push("entity"); //
  // } else if (resultsState.incActivities & resultsState.incOrganizations) {
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
  // }

  // const setCity = (e) => {
  //   setResultsState({ ...resultsState, city: e.target.value })
  // }

  // const searchCity = (e, city) => {
  //   e.preventDefault()

  //   city = resultsState.city

  //   setResultsState({ ...resultsState, municipality: city })

  //   if (resultsState.location) {
  //     window.history.pushState(
  //       'page2',
  //       'Title',
  //       `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
  //         ','
  //       )}&region=${resultsState.location}&municipality=${city}&operator=${
  //         resultsState.operator
  //       }`
  //     )
  //   } else {
  //     window.history.pushState(
  //       'page2',
  //       'Title',
  //       `/search?q=${resultsState.globalQuery}&doctype=${resultsState.filter.join(
  //         ','
  //       )}&municipality=${city}&operator=${resultsState.operator}`
  //     )
  //   }
  // }

  return (
    <main className="page projects-page mt-5">
      <div className="container ">
        <div className="row mt-5" id="SearchBar">
          <SearchBar />
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
                          !doctype.length ||
                          (doctype.includes(ORGANIZATION) && doctype.includes(ACTIVITY))
                        }
                        id="all-type-select"
                        name="type-select"
                        value={`${ORGANIZATION},${ACTIVITY}`}
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
                          doctype.includes(ORGANIZATION) && !doctype.includes(ACTIVITY)
                        }
                        id="organization-type-select"
                        name="type-select"
                        value={ORGANIZATION}
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
                          !doctype.includes(ORGANIZATION) && doctype.includes(ACTIVITY)
                        }
                        id="activity-type-select"
                        name="type-select"
                        value={ACTIVITY}
                        onChange={handleDoctypeFilter}
                      />
                      <label htmlFor="activity-type-select" className="form__radio-label">
                        Activities
                      </label>
                    </div>
                  </form>
                  <form>
                    <hr />
                    {regions.map(({ name, code }) => {
                      const inputId = `region-checkbox-${kebabCase(name)}`
                      const isChecked = Array.isArray(region)
                        ? region.includes(code)
                        : region === code

                      return (
                        <div className="form-check" key={code}>
                          <input
                            className="form-check-input form__input"
                            type="checkbox"
                            checked={isChecked}
                            id={inputId}
                            name={code}
                            onChange={handleRegionFilter}
                          />
                          <label htmlFor={inputId} className="form-check-label">
                            {name}
                          </label>
                        </div>
                      )
                    })}
                    {/* TODO: Refactor the city filter */}
                    {/* <div className="mt-4">
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
                    </div> */}
                  </form>
                  <hr />
                  <p className="text-secondary">More filters coming soon!</p>
                </div>
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
                      {resultsState.entTotal}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="bg-light p-3">
                    <span>Activities: </span>
                    <span className="badge rounded-pill bg-secondary ms-2">
                      {resultsState.actTotal}
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
                  {/* TODO: Disabled until downloading data fixed */}
                  {/* {resultsState.globalQuery && (
                    <a href={resultsState.downloadLink}>Download Results</a>
                  )} */}
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
