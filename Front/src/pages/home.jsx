import Connexion from '../components/connexion';
import { useState, useEffect } from 'react';
import App from '../components/app';
import axios from 'axios';
import { userToken } from '../utils/path';



function Home() {

    //State de base à false
    //On affiche le composant connexion
    //Si connecté => on passe sur la page d'actualité
    //Le composant connexion disparaît

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('JWT')}`
            }
        }

        if (!connected) {
            axios.get(userToken, config)
                .then(function (res) {
                    setConnected(res.data);

                })
                .catch(function (error) {
                    localStorage.removeItem('JWT');

                })
        }


    }, [connected]
    )

    return <div>
        {
            connected ?
                <App auth={connected} /> :
                <Connexion setConnected={setConnected} />
        }


    </div>
}

export default Home;