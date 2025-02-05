import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {

    return (
        <div className="landingPage">
            <nav>
                <Link to="/login"><button className="login_button">Log in</button></Link><br/>
                <p><Link to="/register">Click here to sign up!</Link></p>
            </nav>
        </div>
    )
}

export default LandingPage