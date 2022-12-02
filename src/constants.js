export const allowedSearchParams = ['q', 'city', 'doctype', 'operator', 'region', 'terms']

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
  { name: 'Alberta', codes: ['alberta', 'ab'] },
  { name: 'British Columbia', codes: ['bc', 'british columbia'] },
  { name: 'Manitoba', codes: ['mb', 'manitoba'] },
  { name: 'New Brunswick', codes: ['nb', 'new brunswick'] },
  { name: 'Newfoundland and Labrador', codes: ['nl', 'newfoundland and labrador'] },
  { name: 'Northwest Territories', codes: ['nt', 'northwest territories'] },
  { name: 'Nova Scotia', codes: ['ns', 'nova scotia'] },
  { name: 'Nunavut', codes: ['nu', 'nunavut'] },
  { name: 'Ontario', codes: ['on', 'ontario'] },
  { name: 'Prince Edward Island', codes: ['pe', 'prince edward island'] },
  { name: 'Quebec', codes: ['qc', 'quebec'] },
  { name: 'Saskatchewan', codes: ['sk', 'saskatchewan'] },
  { name: 'Yukon', codes: ['yk', 'yukon'] },
]

export const sidebarTermsData = {
  efc: {
    display: 'EFC',
    terms: ['Sustainability', 'Climate Change', 'Climate Education'],
  },
}
