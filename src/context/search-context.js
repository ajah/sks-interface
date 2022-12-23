import { createContext, useMemo, useState } from 'react'

import { AND, allowedOperators } from 'constants'

export const SearchContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  searchOperator: AND,
  setOperatorHandler: () => {},
})

const SearchContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchOperator, setSearchOperator] = useState(AND)

  const setOperatorHandler = (newOperator) => {
    if (!allowedOperators.includes(newOperator)) return

    setSearchOperator(newOperator)
  }

  const contextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      searchOperator,
      setOperatorHandler,
    }),
    [isLoading, searchOperator]
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

export default SearchContextProvider
