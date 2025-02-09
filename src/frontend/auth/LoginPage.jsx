import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from "dompurify";
import './auth.css';

function LoginPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sanitizeInput = (input) => DOMPurify.sanitize(input).trim();

    const handleUsernameChange = (event) => setUsername(sanitizeInput(event.target.value));
    const handleEmailChange = (event) => setEmail(sanitizeInput(event.target.value));
    const handlePasswordChange = (event) => setPassword(sanitizeInput(event.target.value));
    const handlePassword2Change = (event) => setPassword2(sanitizeInput(event.target.value));

    const navigate = useNavigate();

    return (
        <div>
            <p>login page</p>
            <p>no account? <br/><Link to="/register">Click here to sign up!</Link></p>
            <Link to="/">Go back to home</Link>
        </div>
    )
}

export default LoginPage;