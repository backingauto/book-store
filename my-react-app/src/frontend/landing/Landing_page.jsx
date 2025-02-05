import { Link } from 'react-router-dom';
import './Landing_page.css';

function LandingPage() {

    return (
        <div className="landingPage">
            <nav>
                <Link to="/login"><button className="loginButton">Log in</button></Link>
            </nav>
        </div>
    )
}

export default LandingPage