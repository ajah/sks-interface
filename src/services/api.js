import axios from 'axios'

import { ENTITY, ORGANIZATION } from 'constants'
import { getQueryString } from 'utils/query'

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 90000,
})

api.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      const doctypeParam = config.params?.doctype
      if (doctypeParam) {
        // Backend uses 'entity' keyword instead of 'organization
        config.params.doctype = config.params.doctype.map((type) =>
          type === ORGANIZATION ? ENTITY : type
        )
      }
      console.log('config.params', config.params)
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

export const Get = async (url, params = {}) => {
  const { data } = await api.get(url, { params })

  return data
}
