import { useMemo } from 'react'
import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { pick } from 'lodash'

import { allowedSearchParams } from 'constants'
import { getQueryString } from 'utils/query'

export const useSearchParams = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const currentSearchParams = queryString.parse(search, { arrayFormat: 'comma' })

  return useMemo(() => {
    const modifySearchParams = (newSearchParams, options = {}) => {
      const { overwrite = false, replace = false, requestedPathname } = options

      const combinedSearchParams = {
        ...(!overwrite && currentSearchParams),
        ...newSearchParams,
      }

      const filteredSearchParams = pick(combinedSearchParams, allowedSearchParams)

      navigate(
        `${requestedPathname || pathname}${getQueryString(filteredSearchParams)}`,
        {
          replace,
        }
      )
    }

    return [currentSearchParams, modifySearchParams]
  }, [currentSearchParams, navigate, pathname])
}
