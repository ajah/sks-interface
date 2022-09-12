import { createContext, useState } from 'react'

import { AND, allowedOperators } from 'constants'

export const SearchContext = createContext({
  query: '',
  searchHandler: () => {},
})

const SearchContextProvider = ({ children }) => {
  const [inputFieldQuery, setInputFieldQuery] = useState('')
  const [allQueries, setAllQueries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchOperator, setSearchOperator] = useState(AND)

  const searchHandler = (newQuery) => {
    setInputFieldQuery(newQuery)
  }

  const addQueryHandler = (newQuery) => {
    setAllQueries([...allQueries, newQuery])
  }

  const removeQueryHandler = (removeQuery) => {
    setAllQueries(allQueries.filter((query) => query !== removeQuery))
  }

  const isLoadingHandler = (newIsLoading) => {
    setIsLoading(newIsLoading)
  }

  const setOperatorHandler = (newOperator) => {
    if (!allowedOperators.includes(newOperator)) return

    setSearchOperator(newOperator)
  }

  return (
    <SearchContext.Provider
      value={{
        query: inputFieldQuery,
        searchHandler,
        searchArray: allQueries,
        addQueryHandler,
        removeQueryHandler,
        loading: isLoading,
        loadingHandler: isLoadingHandler,
        searchOperator,
        setOperatorHandler,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider
