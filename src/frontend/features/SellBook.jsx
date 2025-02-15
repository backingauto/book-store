import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";  
import NavBar from '../NavBar';

function Dashboard() {

    return (
        <div>
            <NavBar />

            <div className='sellBookPage'>
                
            </div>
            <p>sell books</p>
        </div>
    )
}

export default Dashboard;