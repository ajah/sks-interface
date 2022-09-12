import { createContext, useMemo, useState } from 'react'

import { AND, allowedOperators } from 'constants'

export const SearchContext = createContext({
  isLoading: false,
  isLoadingHandler: () => {},
  searchOperator: AND,
  setOperatorHandler: () => {},
})

const SearchContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchOperator, setSearchOperator] = useState(AND)

  const isLoadingHandler = (newIsLoading) => {
    setIsLoading(newIsLoading)
  }

  const setOperatorHandler = (newOperator) => {
    if (!allowedOperators.includes(newOperator)) return

    setSearchOperator(newOperator)
  }

  const contextValue = useMemo(
    () => ({
      isLoading,
      isLoadingHandler,
      searchOperator,
      setOperatorHandler,
    }),
    [isLoading, searchOperator]
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

export default SearchContextProvider
