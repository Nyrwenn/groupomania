import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logoLine from '../assets/icon-left-font2.png';
import './login.scss';
import axios from 'axios';
import { postLogin } from '../utils/path';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const send = (e) => {
        e.preventDefault();

        axios.post(postLogin, {
            email: e.target.email.value,
            password: e.target.password.value
        })
            .then(function (res) {
                props.setConnected(res.data);
                localStorage.setItem('JWT', res.data.token);
                console.log(res);
            })
            .catch(function (error) {
                console.log(error)
            })



    }
    return <div className="homeWrapper">
        <header className="logoContainer">
            <img id="logo_row" src={logoLine} alt="Logo Groupomania" />
        </header>
        <form className="form" onSubmit={(e) => send(e)}>
            <label htmlFor="email" className="txtInput">Email</label>
            <input type="email" id="email" className="inputs_login" name="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="txtInput" name="password">Mot de passe</label>
            <input type="password" id="password" className="inputs_login" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input id="btnConnexion" type="submit" value="Connexion" />
        </form>

        <div className="createAccount">
            <Link to='/signup' style={{ color: "black", cursor: "pointer" }} ><p className="no-style">Créez votre compte</p></Link>
        </div>
    </div>
}

export default Login;