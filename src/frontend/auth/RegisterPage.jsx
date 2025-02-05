import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";


function RegisterPage() {

    const [user_info, set_user_info] = useState({
        username: "",
        email: "",
        password: "",
    })

    const navigate = useNavigate();



    return (
        <div className='register_page'>
            <p>regsiter page</p>

            <div className='register_container'>
                <h1>Create an Account</h1>
                <h2>Please enter your info</h2>

                <form onSubmit={}
            </div>

            <Link to="/">Go back to home</Link>
        </div>
    )
}

export default RegisterPage;