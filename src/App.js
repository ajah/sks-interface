import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Footer } from 'components/Footer'
import { NavBar } from 'components/NavBar'

import { AboutUsPage } from 'views'
import { ActivitiesPage } from 'views'
import { GrantsPage } from 'views'
import { ContactPage } from 'views'
import { HomePage } from 'views'
import { OrgPage } from 'views'
import { ResultsPage } from 'views'

export default function App() {
  return (
    <Router>
      <NavBar />
      <br />
      <Routes>
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="activities/:id" element={<ActivitiesPage />} />
        <Route path="entities/:id" element={<OrgPage />} />
        <Route path="grants/:id" element={<GrantsPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
      <Footer />
    </Router>
  )
}
