import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import Header from './frontend/asdf'
import LandingPage from './frontend/landing_page/Landing_page'

function App() {

  return (
    <BrowserRouter>
      <>
        <Header/>
        <LandingPage/>
        
      </>
    </BrowserRouter>
  )
}

export default App
