import axios from 'axios'
import { castArray, keyBy, toLower } from 'lodash'

import { ENTITY, ORGANIZATION, regions } from 'constants'
import { getQueryString } from 'utils/query'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 90000,
})

const regionsCodeToNameMap = keyBy(regions, 'codes.0')

api.interceptors.request.use(
  (config) => {
    // GET
    if (config.method === 'get') {
      // Custom params serializer, for using our preferred array delimiters, etc

      config.params = interceptGetQueryParamsForApi(config.params)
      config.paramsSerializer = (params) =>
        getQueryString(params, { addQueryPrefix: false, skipEmptyString: false })
    }

    return config
  },
  (error) => {
    console.log('Api intercept error:', error)
    return Promise.reject(error)
  }
)

const interceptGetQueryParamsForApi = (params) => {
  const doctypeParam = params?.doctype
  console.log('doctypeParam:', doctypeParam)

  if (doctypeParam) {
    // Backend uses 'entity' keyword instead of 'organization
    params.doctype = castArray(doctypeParam).map((type) =>
      type === ORGANIZATION ? ENTITY : type
    )
  }

  const regionParam = params.region
  if (regionParam) {
    const lowerRegionParam = castArray(regionParam).map(toLower)
    const parsedRegionForApi = regions
      .filter(({ codes }) => codes.some((code) => lowerRegionParam.includes(code)))
      .map(({ codes }) => regionsCodeToNameMap[codes[0]].name)

    params.region = parsedRegionForApi
  }

  return params
}

export const createDownloadLink = (params) => {
  const parsedParams = interceptGetQueryParamsForApi(params)
  const queryString = getQueryString(parsedParams, {
    addQueryPrefix: false,
    skipEmptyString: false,
  })
  return `${process.env.REACT_APP_API_URL}/download?${queryString}`
}

export const Get = async (url, params = {}) => {
  const { data } = await api.get(url, { params })

  return data
}
