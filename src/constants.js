export const allowedSearchParams = ['q', 'city', 'doctype', 'operator', 'region']

export const AND = 'and'
export const OR = 'or'

export const allowedOperators = [AND, OR]
export const DEFAULT_OPERATOR = AND

export const ACTIVITY = 'activity'
export const ENTITY = 'entity' // api only
export const ORGANIZATION = 'organization'

export const allowedDoctypes = [ACTIVITY, ORGANIZATION]
export const defaultDoctype = [ACTIVITY, ORGANIZATION]

export const regions = [
  { name: 'Alberta', code: 'alberta' },
  { name: 'British Columbia', code: 'british columbia' },
  { name: 'Manitoba', code: 'manitoba' },
  { name: 'New Brunswick', code: 'new brunswick' },
  { name: 'Newfoundland and Labrador', code: 'newfoundland and labrador' },
  { name: 'Northwest Territories', code: 'northwest territories' },
  { name: 'Nova Scotia', code: 'nova scotia' },
  { name: 'Nunavut', code: 'nunavut' },
  { name: 'Ontario', code: 'ontario' },
  { name: 'Prince Edward Island', code: 'prince edward island' },
  { name: 'Quebec', code: 'quebec' },
  { name: 'Saskatchewan', code: 'saskatchewan' },
  { name: 'Yukon', code: 'yukon' },
]
