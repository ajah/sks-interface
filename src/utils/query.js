import queryString from 'query-string'
import { mapValues, omit } from 'lodash'

export const getQueryString = (params, options = {}) => {
  const { addQueryPrefix = true, skipEmptyString = true } = options

  const searchTermQuery = queryString.stringify(
    { q: params.q },
    {
      skipEmptyString,
      arrayFormat: 'separator',
      arrayFormatSeparator: '+',
      skipNull: true,
    }
  )

  const remainingParams = omit(params, 'q')
  // Since qs will remove params with value equal to [],
  // convert it to a '' so that the key will be kept in the query if skipEmptyString is false
  const parsedRemainingParams = mapValues(remainingParams, (val) =>
    skipEmptyString ? val : Array.isArray(val) && !val.length ? '' : val
  )

  const remainingQuery = queryString.stringify(parsedRemainingParams, {
    skipEmptyString,
    arrayFormat: 'comma',
    skipNull: true,
  })

  if (!searchTermQuery.length && !remainingQuery.length) return ''

  const prefix = addQueryPrefix ? '?' : ''

  if (!searchTermQuery.length || !remainingQuery.length)
    return `${prefix}${searchTermQuery || remainingQuery}`

  return `${prefix}${searchTermQuery}&${remainingQuery}`
}
