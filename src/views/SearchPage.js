import { useEffect, useState, useContext } from 'react'
import {
  castArray,
  deburr,
  isEqual,
  kebabCase,
  pick,
  toLower,
  without,
  uniq,
} from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { SearchBar } from 'components/SearchBar'
import { SidebarFilterTerms } from 'components/SidebarFilterTerms'
import { TableRows } from 'components/TableRows'

import { SearchContext } from 'context/search-context'
import { useSearchParams } from 'hooks'
import { createDownloadLink, Get } from 'services/api'
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
  sidebarTermsData,
} from 'constants'

// TODO: move styles.css import into SearchPage.css
import 'assets/css/styles.css'
import './SearchPage.css'

const initialResultsState = {
  // TODO: Review state vars below and see which are unnecessry
  total: '',
  results: [],
  actTotal: '',
  entTotal: '',
  incActivities: true,
  incOrganizations: true,
  globalQuery: '',
  city: '',
  downloadData: '',
  downloadLink: '',
}

const SearchPage = () => {
  const searchContext = useContext(SearchContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [resultsState, setResultsState] = useState(initialResultsState)
  const [cityInput, setCityInput] = useState('')

  const {
    q = [],
    city = [],
    doctype = [],
    operator = '',
    region = [],
    terms = [],
  } = searchParams

  // Params that can have multiple values separated by commas will be a string when one value is provided,
  // and an array when multiple values are provided
  const qStr = q.toString()
  const doctypeStr = doctype.toString()
  const regionStr = region.toString()
  const cityStr = city.toString()
  const termsStr = terms.toString()

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
      const qArr = castArray(q)

      // Each query term should be limited to maxQueryTermLength chars
      // and there should be a max of maxQueryTerms query terms
      const parsedQArr = uniq(
        qArr
          .map((aQuery) => aQuery.trim())
          .map((aQuery) => aQuery.replace(/[\s]{2,}/g, ' '))
          .map((aQuery) => aQuery.slice(0, maxQueryTermLength))
          .map(deburr)
          .filter((aQuery) => aQuery)
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
          .map((aCity) => aCity.replace(/[\s]{2,}/g, ' '))
          .map(deburr)
          .filter((aCity) => aCity.length < maxQueryTermLength)
          .filter((aCity) => aCity)
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
      const parsedRegionArr = uniq(regionArr)
        .map(toLower)
        .filter((regionCode) => regions.some(({ codes }) => codes.includes(regionCode)))

      // Check 'terms' that can be selected in sidebar
      const termsArr = termsStr ? termsStr.split(',') : []

      const parsedTermsArr = uniq(termsArr).filter((catAndTerm) => {
        const [catLower, termLower] = catAndTerm
          .split('_')
          .map(toLower)
          .map((s) => s.trim())

        if (!catLower || !termLower) return false

        const termsForCat = sidebarTermsData[catLower]
        if (!termsForCat?.terms.map(toLower).includes(termLower)) return false

        return true
      })

      const incompleteParams =
        !parsedQArr.length &&
        !parsedCityArr.length &&
        !parsedTermsArr.length &&
        !parsedRegionArr.length

      if (incompleteParams) return setResultsState(initialResultsState)

      const changedParams =
        qStr.length !== parsedQArr.toString().length ||
        doctypeArr.length !== parsedDoctypeArr.length ||
        operator !== parsedOperator ||
        regionArr.length !== parsedRegionArr.length ||
        !isEqual(cityArr.map(toLower), parsedCityArr.map(toLower)) ||
        !isEqual(termsArr.map(toLower), parsedTermsArr.map(toLower))

      if (changedParams) {
        setSearchParams(
          {
            q: parsedQArr,
            city: parsedCityArr,
            doctype: parsedDoctypeArr,
            operator: parsedOperator,
            region: parsedRegionArr,
            terms: parsedTermsArr,
          },
          { replaceParams: true }
        )

        return
      }

      // TODO: combine terms with parsedQArr
      const finalParams = {
        q: parsedQArr,
        doctype: parsedDoctypeArr,
        operator: parsedOperator,
        region: parsedRegionArr,
        city: parsedCityArr,
        terms: parsedTermsArr,
      }

      Promise.all([
        Get('/search', finalParams),
        // TODO: Check why count route does not take more params?
        Get('/count', finalParams),
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
  }, [qStr, cityStr, doctypeStr, operator, regionStr, termsStr])

  const handleRegionFilter = (e) => {
    const regionCode = e.target.name
    const regionArr = castArray(region)

    const adjustedRegion = regionArr.includes(regionCode)
      ? without(regionArr, regionCode)
      : [...regionArr, regionCode]

    setSearchParams({ region: adjustedRegion })
  }

  const handleDoctypeFilter = (e) => {
    const newDoctype = e.target.value
    setSearchParams({ doctype: newDoctype.split(',') })
  }

  const handleCityFilter = (e) => {
    e.preventDefault()

    if (!cityInput) return

    const cityArr = castArray(city)
    const cityArrLower = cityArr.map(toLower)
    const cleanedCityInput = deburr(cityInput.trim().replace(/[\s]{2,}/g, ' '))
    const cleanedCityInputLower = cleanedCityInput.toLowerCase()

    setCityInput('')

    if (cityArrLower.includes(cleanedCityInputLower)) return

    setSearchParams({ city: [...cityArr, cleanedCityInput] })
  }

  const handleTermsFilter = (key) => {
    const termsArr = castArray(terms)
    const termsArrLower = termsArr.map(toLower)

    if (termsArrLower.includes(key)) {
      const index = termsArrLower.indexOf(key)
      setSearchParams({
        terms: without(termsArr, termsArr[index]),
      })
      return
    }

    setSearchParams({
      terms: [...termsArr, key],
    })
  }

  const handleRemoveCity = (cityToRemove) => {
    const cityArr = castArray(city)
    const newCityArr = without(cityArr, cityToRemove)
    setSearchParams({ city: newCityArr })
  }

  const handleEnterKeyCityHandler = (e) => {
    if (e.key !== 'Enter') return

    handleCityFilter(e)
  }

  // TODO: Move city filter into own component along with line below:
  const cityInputDisabled =
    castArray(city).length >= process.env.REACT_APP_MAX_QUERY_CITIES

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
                  <form className="mb-4">
                    <hr />
                    {regions.map(({ name, codes }) => {
                      const code = codes[0]
                      const inputId = `region-checkbox-${kebabCase(name)}`
                      const isChecked = codes.some((aCode) =>
                        castArray(region).includes(aCode)
                      )

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
                    <div className="mt-4">
                      <label htmlFor="city-select" className="form-check-label mb-2">
                        City:
                      </label>

                      <div className="city-block">
                        <input
                          className="form-control rounded-pill"
                          type="text"
                          name="city-select"
                          onChange={(e) =>
                            e.target.value.length < maxQueryTermLength &&
                            setCityInput(e.target.value)
                          }
                          value={cityInput}
                          id="city-select"
                          disabled={cityInputDisabled}
                          placeholder={cityInputDisabled ? 'Max reached' : ''}
                          onKeyPress={handleEnterKeyCityHandler}
                        />
                        <div>
                          <button
                            disabled={cityInputDisabled}
                            className="ms-2 btn btn-primary"
                            onClick={(e) => handleCityFilter(e)}
                          >
                            <FontAwesomeIcon
                              className="d-inline"
                              size="sm"
                              icon={faPlus}
                            />
                          </button>
                        </div>
                      </div>
                      <div>
                        {uniq(castArray(city)).map((aCity) => (
                          <div
                            className="search-query border col-2 ps-3 rounded-pill mt-2"
                            // Search terms should be unique
                            key={aCity}
                          >
                            {aCity}
                            <div className="ms-2 me-1" size="sm">
                              <FontAwesomeIcon
                                className="remove-query"
                                onClick={() => handleRemoveCity(aCity)}
                                icon={faTimesCircle}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                  <hr />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  <h5>Terms</h5>
                  {/*  <div className="mt-3" id="FFBC">
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
                        </div> */}
                  {Object.entries(sidebarTermsData).map(
                    ([category, { display, terms: termsDisplay }]) => (
                      <SidebarFilterTerms
                        key={category}
                        onChangeHandler={handleTermsFilter}
                        termsUsed={castArray(terms)}
                        termsDisplay={termsDisplay}
                        category={category}
                        categoryDisplay={display}
                      />
                    )
                  )}
                </div>
              </div>
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
                  {!!resultsState.results.length && (
                    <a
                      href={createDownloadLink({
                        q,
                        city,
                        doctype,
                        operator,
                        region,
                        terms,
                      })}
                    >
                      Download Results
                    </a>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
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
