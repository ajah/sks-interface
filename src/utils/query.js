import queryString from 'query-string'

export const getQueryString = (keyVals) => {
  const query = queryString.stringify(keyVals, {
    arrayFormat: 'comma',
    skipNull: true,
  })

  return query.length ? `?${query}` : ''
}
