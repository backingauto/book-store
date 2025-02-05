import './App.css'
import { BrowserRouter } from 'react-router-dom';
import NavBar from './frontend/navBar/NavBar'
import LandingPage from './frontend/landing/Landing_page'

function App() {

  return (
    <BrowserRouter>
      <>
        <NavBar/>
        <LandingPage/>
        
      </>
    </BrowserRouter>
  )
}

export default App
