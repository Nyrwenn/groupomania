import Logo from '../assets/icon-above-font.png';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/actu.scss';
import '../pages/article.scss';
import axios from 'axios';
import React, { useState } from 'react';
import FormData from 'form-data';
import { postArticle } from '../utils/path';



function Article(props) {
    const navigate = useNavigate();
    const auth = props.auth;
    const [legend, setLegend] = useState('');

    function disconnected() {
        localStorage.removeItem('JWT');
        window.location.reload();

    }



    const send = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append(
            "image",
            e.target.picture.files[0],
            e.target.picture.files[0].name
        );
        data.set("userId", auth.userId);
        data.set("legend", legend);

        axios.post(postArticle, data, {
            headers: {
                'Content-Type': `multipart/form-data`,
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(function (res) {
                console.log(res)
                return navigate('/');
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    return <div className="appWrapper">
        <header className="header">
            <div className="logo_container">
                <Link to="/">
                    <img id="logo_column" src={Logo} alt="Logo Groupomania" />
                </Link>
            </div>
            <h1 className="title">Créer une publication</h1>
            <div className="nav_container">
                <Link to="/profile" ><p className="nav">Profil</p></Link>
                <p className="nav" onClick={() => disconnected()}>Déconnexion</p>
            </div>
        </header>
        <div className="bodyWrapper">
            <div className="legend">
                <form className="form_post" onSubmit={(e) => send(e)}>
                    <div className="legend_container">
                        <label htmlFor="legend" className="legend_title">Légendez votre contenu</label>
                        <textarea id="legend" className="legend_txt" name="legend" maxlenght="500" placeholder="Si vous le souhaitez vous pouvez saisir une légende pour votre image (max. 500 caractères)."
                            value={legend}
                            onChange={(e) => setLegend(e.target.value)}
                        />
                    </div>
                    <div className="legend_container">
                        <label htmlFor="picture" className="picture_title" name="picture">Ajoutez une image</label>
                        <input type="file" id="picture" name="picture" accept="image/png, image/jpeg, image/jpg" />
                    </div>

                    <input id="btnConnexion" type="submit" value="Publier" />
                </form>

            </div>

        </div>
    </div>
}

export default Article;