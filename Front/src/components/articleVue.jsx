import '../components/articleVue.scss';
import avatarExple from '../assets/avatar-de-lutilisateur.png';
import { useState } from 'react';
import FormData from 'form-data';
import axios from 'axios';
import Comments from '../components/comments';
import CommentsVue from '../components/commentsVue';
import { delArticle, putArticle, getLike } from '../utils/path';


function ArticleVue(props) {
    const article = props.article;
    const User = article.User;
    const auth = props.auth;
    const refresh = props.refresh;

    const [modify, setModify] = useState(false);
    const [changePicture, setChangePicture] = useState(false);
    const [filePicture, setFilePicture] = useState(article.picture);
    const [legend, setLegend] = useState(article.legend);
    const [comment, setComment] = useState(false);
    const [showComments, setShowComments] = useState(false);


    const deleteArticle = (id) => {
        const config = {
            headers: {
                'Content-Type': `multipart/form-data`,
                Authorization: `Bearer ${auth.token}`
            }
        };

        axios.delete(delArticle + article.id, config)
            .then(function (res) {
                refresh(true);
                console.log(res)
            })
            .catch(function (error) {
                console.log(error)
            });

    }

    const updateArticle = (e) => {
        e.preventDefault();

        if (changePicture) {
            const dataSend = new FormData();
            dataSend.append(
                "image",
                e.target.picture.files[0],
                e.target.picture.files[0].name
            );

            dataSend.set("legend", legend);
            const config = {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    Authorization: `Bearer ${props.auth.token}`
                }
            };

            axios.put(putArticle + article.id, dataSend, config)
                .then(function (res) {
                    setModify(false);
                    refresh(true);
                    console.log(res);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log('false', changePicture)

            const config = {
                headers: {
                    'Content-Type': `application/json`,
                    Authorization: `Bearer ${props.auth.token}`
                }
            };

            axios.put(putArticle + article.id, { legend: legend }, config)

                .then(function (res) {
                    setModify(false);
                    refresh(true);
                    console.log(res);
                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }

    const likeArticle = (e) => {
        const config = {
            headers: {
                Authorization: `Bearer ${props.auth.token}`
            }
        };

        axios.get(getLike + article.id, config)
            .then(function (res) {
                refresh(true);

                console.log(res)
            })
            .catch(function (error) {
                console.log(error)
            })


    }


    return <article className="container_article">
        <div className="small_avatar_container">
            <div className="small_circle"
                style={{
                    backgroundImage: `url(${User.avatar ? User.avatar : avatarExple})`,
                    backgroundSize: "cover"
                }}
            ></div>
            <p className="user_title" >{User.name} {User.firstname} a partagé:</p>
            <div className="modify_delete_container">
                {
                    (auth.userId === article.UserId || auth.admin) &&
                    <>
                        <p className="modify_delete" onClick={() => setModify(!modify)}>Modifier</p>
                        <p className="modify_delete" onClick={() => deleteArticle(article.id)}>Supprimer</p>
                    </>
                }

            </div>

        </div>
        {!modify ?
            <>
                <div className="container_legend">
                    {article.legend}
                </div>

                <div className="container_picture">
                    <img className="img" src={article.picture} alt={article.id} />
                </div>

            </> :

            <form className="form_post" onSubmit={(e) => updateArticle(e)}>
                <div><textarea id="legend" maxLength="500" value={legend} className="legend_txt" style={{ width: "100%" }} onChange={(e) => setLegend(e.target.value)}></textarea> </div>
                <img className="container_picture" src={filePicture} alt={article.id} />
                <div><input type="file" id="picture" accept="image/png, image/jpeg, image/jpg" style={{ width: "100%" }} onChange={(e) => {
                    setFilePicture(URL.createObjectURL(e.target.files[0]))
                    setChangePicture(true)
                }

                } /></div>
                <input id="btnConnexion" type="submit" value="Modifier" />
            </form>
        }
        <div className="line"></div>
        <div className="container_liker_comment">
            <p className="liker_comment" onClick={() => likeArticle()}>Liker</p>
            <p className="liker_comment" onClick={() => setComment(!comment)}>Commenter</p>
        </div>
        <p className="counter">{article.Likes.length}</p>
        {
            comment &&
            <Comments auth={auth} setComment={setComment} article={article} refresh={refresh} />
        }

        <p className="showmore" onClick={() => setShowComments(!showComments)}>Voir les commentaires</p>

        {
            showComments &&

            <CommentsVue article={article} auth={auth} refresh={refresh} />
        }

    </article>
}


export default ArticleVue;