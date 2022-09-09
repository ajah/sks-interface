export const allowedSearchParams = ['q', 'doctype', 'operator', 'region']

export const AND = 'and'
export const OR = 'or'

export const allowedOperators = [AND, OR]
export const DEFAULT_OPERATOR = AND

export const ACTIVITY = 'activity'
export const ORGANIZATION = 'organization'

export const allowedDoctypes = [ACTIVITY, ORGANIZATION]
export const defaultDoctype = [ACTIVITY, ORGANIZATION]

export const regions = [
  { name: 'Alberta', code: 'ab' },
  { name: 'British Columbia', code: 'bc' },
  { name: 'Manitoba', code: 'mb' },
  { name: 'New Brunswick', code: 'nb' },
  { name: 'Newfoundland and Labrador', code: 'nl' },
  { name: 'Northwest Territories', code: 'nt' },
  { name: 'Nova Scotia', code: 'ns' },
  { name: 'Nunavut', code: 'nu' },
  { name: 'Ontario', code: 'on' },
  { name: 'Prince Edward Island', code: 'pe' },
  { name: 'Quebec', code: 'qc' },
  { name: 'Saskatchewan', code: 'sk' },
  { name: 'Yukon', code: 'yk' },
]
