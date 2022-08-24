import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import HomePage from './components/homePage'
import AboutUs from './components/aboutUs'
import ResultsPage from './components/resultsPage'
import Contact from './components/contact'
import OrgPage from './components/orgPage'
import ActPage from './components/actPage'
import AllActs from './components/allActs'

export default function App() {
  return (
    <Router>
      <Navbar />
      <br />
      <Route exact path="/" component={HomePage} />
      <Route exact path="/about-us" component={AboutUs} />
      <Route exact path="/results" component={ResultsPage} />
      <Route exact path="/contact" component={Contact} />
      <Route exact path="/activities/:id" component={ActPage} />
      <Route exact path="/entities/:id" component={OrgPage} />
      <Route exact path="/activitiesbyent/:ent_id" component={AllActs} />

      <Footer />
    </Router>
  )
}
