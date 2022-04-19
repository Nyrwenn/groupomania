import { useState } from 'react';
import axios from 'axios';
import { postComment } from '../utils/path';

function Comment(props) {
    const auth = props.auth;
    const article = props.article;
    const refresh = props.refresh;
    const setComment = props.setComment;
    const [commentary, setCommentary] = useState('');

    const send = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        };

        axios.post(postComment + article.id, { commentary: commentary }, config)
            .then(function () {
                setComment(false);
                refresh(true);

            })
            .catch(function (error) {
                console.log(error)
            })

    }




    return <div className="comment_wrapper" style={{ display: "flex", justifyContent: "center" }}>
        <form className="comment" onSubmit={(e) => send(e)}>
            <div className="textarea_container" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label htmlFor="comment_txt" name="comment_txt" style={{ marginBottom: "10px", marginTop: "10px" }}>Votre commentaire:</label>
                <textarea id="comment_txt" name="comment_txt" maxlenght="500" placeholder="Saisissez votre commentaire" style={{ width: "300px", height: "150px", border: "2px solid black", borderRadius: "15px" }}
                    value={commentary}
                    onChange={(e) => setCommentary(e.target.value)}
                />
                <input id="btnConnexion" type="submit" value="Publier" style={{ marginBottom: "10px" }} />
            </div>
        </form>
    </div>

}

export default Comment;