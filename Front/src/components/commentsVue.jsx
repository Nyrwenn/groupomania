import '../components/articleVue.scss';
import avatarExple from '../assets/avatar-de-lutilisateur.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { delComment } from '../utils/path';

function CommentsVue(props) {
    const article = props.article;
    const comments = article.Comments;
    const auth = props.auth;
    const refresh = props.refresh;

    function deleteComment(id) {

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        }
        axios.delete(delComment + id, config)
            .then(function (res) {
                refresh(true);
            })
            .catch(function (error) {
                console.log(error)
            })


    }

    return <div className="comments_wrapper" style={{ display: "flex", flexDirection: "column", width: "100%" }}>


        {

            comments.map((comment, i) => (

                <div key={i} className="container_article" style={{ height: "auto" }}>
                    <div className="small_avatar_container" style={{ marginBottom: "10px", height: "auto" }}>
                        <div className="small_circle"
                            style={{
                                backgroundImage: `url(${comment.User.avatar ? comment.User.avatar : avatarExple})`,
                                backgroundSize: "cover",
                                minWidth: "30px", minHeight: "30px"
                            }}
                        ></div>


                        <div style={{ width: "100%", display: "flex", flexDirection: "row", fontSize: "14px" }}>
                            <p className="user_title" style={{ fontSize: "14px" }}>{comment.User.name} {comment.User.firstname} a commenté:</p>
                        </div>
                        {
                            (auth.userId === comment.User.id || auth.admin) &&
                            <div onClick={() => deleteComment(comment.id)}><FontAwesomeIcon icon={faXmark} size="xl" style={{ color: "#FD2D01", marginRight: "10px", marginTop: "5px", cursor: "pointer" }} /></div>
                        }

                    </div>
                    <p style={{ display: "flex", width: "100%", fontSize: "14px", marginLeft: "40px" }}>{comment.commentary}</p>
                </div>
            ))
        }


    </div>

}

export default CommentsVue;
