import React from 'react'

export default function BackToEntButton() {
  const url = new URL(window.location.href)
  const ent_sks_id = url.pathname.split('/')[2]

  return (
    <div>
      <a href={`/entities/${ent_sks_id}`}>
        <button className="btn btn-outline-primary">Back to Organization</button>
      </a>
    </div>
  )
}
