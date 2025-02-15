import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

function Dashboard() {

    return (
        <div>
            <NavBar />

            <div className='dashboardPage'>
                <Link to="/addBook">
                    <button className='addBooksButton'>Sell books</button>
                </Link>
            </div>
            <p>dashboard</p>
        </div>
    )
}

export default Dashboard;