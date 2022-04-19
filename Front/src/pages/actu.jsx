import "../pages/actu.scss";
import Logo from '../assets/icon-above-font.png';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleVue from '../components/articleVue';
import { getArticle } from '../utils/path';



function Actu(props) {
    const auth = props.auth;
    const [articles, setArticles] = useState([]);
    const [refresh, setRefresh] = useState(true);


    function disconnected() {
        localStorage.removeItem('JWT');
        window.location.reload();

    }

    useEffect(() => {

        if (refresh) {


            const config = {
                headers: { Authorization: `Bearer ${auth.token}` }
            };

            axios.get(getArticle, config)
                .then((res) => {
                    const sort = res.data.sort(function (b, a) {
                        if (a.updatedAt < b.updatedAt) {
                            return -1;
                        }
                        if (a.updatedAt > b.updatedAt) {
                            return 1;
                        }
                        return 0;
                    });
                    setArticles(sort);
                    setRefresh(false);

                })
                .catch((error) => console.log(error))

        }
    }, [auth, refresh])

    return <div className="appWrapper">
        <header className="header">
            <div className="logo_container">
                <img id="logo_column" src={Logo} alt="Logo Groupomania" />
            </div>
            <h1 className="title">Fil d'actualités</h1>
            <div className="nav_container">
                <Link to="/profile" ><p className="nav">Profil</p></Link>
                <p className="nav" onClick={() => disconnected()}>Déconnexion</p>
            </div>

        </header>
        <div className="body">
            <div className="container_btn_articles">
                <div className="btn_container">
                    <Link to="/article" style={{ textDecoration: "none" }}><button id="redButton" type="button">Publier une actualité</button></Link>
                </div>
                <div className="articles">
                    {
                        articles.map((article, i) => (
                            <ArticleVue key={i} article={article} auth={auth} refresh={setRefresh} />
                        ))
                    }
                </div>
            </div>

        </div>

    </div>


}

export default Actu;