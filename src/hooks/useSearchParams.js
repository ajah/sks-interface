import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { omit, pick } from 'lodash'

import { allowedSearchParams } from 'constants'
import { getQueryString } from 'utils/query'

export const useSearchParams = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const qParam = pick(
    queryString.parse(search, {
      arrayFormat: 'separator',
      arrayFormatSeparator: '+',
      skipEmptyString: true,
    }),
    'q'
  )

  const remainingParams = omit(
    queryString.parse(search, { arrayFormat: 'comma', skipEmptyString: true }),
    'q'
  )

  const currentSearchParams = { ...qParam, ...remainingParams }

  const modifySearchParams = (newSearchParams, options = {}) => {
    const { replaceParams = false, replacePage = false, requestedPathname } = options

    const combinedSearchParams = {
      ...(!replaceParams && currentSearchParams),
      ...newSearchParams,
    }

    const filteredSearchParams = pick(combinedSearchParams, allowedSearchParams)

    navigate(`${requestedPathname || pathname}${getQueryString(filteredSearchParams)}`, {
      replace: replacePage,
    })
  }

  return [currentSearchParams, modifySearchParams]
}
