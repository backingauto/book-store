import { Link, useNavigate } from 'react-router-dom';


function LoginPage() {

    return (
        <div>
            <p>login page</p>
            <p>no account? <br/><Link to="/register">Click here to sign up!</Link></p>
            <Link to="/">Go back to home</Link>
        </div>
    )
}

export default LoginPage;