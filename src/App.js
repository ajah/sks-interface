import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Footer } from 'components/Footer'
import { NavBar } from 'components/NavBar'

import { AboutUsPage } from 'views'
import { ActivitiesPage } from 'views'
import { AllActivitiesPage } from 'views'
import { ContactPage } from 'views'
import { HomePage } from 'views'
import { OrgPage } from 'views'
import { ResultsPage } from 'views'

export default function App() {
  return (
    <Router>
      <NavBar />
      <br />
      <Route exact path="/about-us" component={AboutUsPage} />
      <Route exact path="/results" component={ResultsPage} />
      <Route exact path="/contact" component={ContactPage} />
      <Route exact path="/activities/:id" component={ActivitiesPage} />
      <Route exact path="/entities/:id" component={OrgPage} />
      <Route exact path="/activitiesbyent/:ent_id" component={AllActivitiesPage} />
      <Route path="/" component={HomePage} />
      <Footer />
    </Router>
  )
}
