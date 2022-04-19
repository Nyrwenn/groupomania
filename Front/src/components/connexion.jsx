import '../components/login.scss';
import { Routes, Route } from "react-router-dom";
import Signup from '../pages/signup';
import Login from '../components/login';


function Connexion(props) {

    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Login setConnected={props.setConnected} />} />
                <Route path="/signup" element={<Signup txtButton={"Créer mon compte"} />} />
            </Routes>
        </div>
    )
}

export default Connexion;