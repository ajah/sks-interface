import { useState } from 'react'
import { kebabCase, toLower } from 'lodash'
import { GoTriangleDown, GoTriangleRight } from 'react-icons/go'

const SidebarFilterTerms = ({
  category,
  categoryDisplay,
  termsUsed,
  termsDisplay,
  onChangeHandler,
}) => {
  const [termsOpen, setTermsOpen] = useState(true)

  return (
    <div className="mt-3" key={category}>
      <strong>
        <button className="sidebar-btn" onClick={() => setTermsOpen(!termsOpen)}>
          {termsOpen ? <GoTriangleDown /> : <GoTriangleRight />} {categoryDisplay}
        </button>
      </strong>
      {termsOpen &&
        termsDisplay.map((term) => {
          const key = `${category}_${toLower(term)}`

          return (
            <div className="form-check mt-1" key={key}>
              <input
                className="form-check-input"
                type="checkbox"
                onChange={() => onChangeHandler(key)}
                checked={termsUsed.includes(key)}
                id={kebabCase(key)}
              />
              <label className="form-check-label" htmlFor={kebabCase(key)}>
                {term}
              </label>
            </div>
          )
        })}
    </div>
  )
}

export default SidebarFilterTerms
