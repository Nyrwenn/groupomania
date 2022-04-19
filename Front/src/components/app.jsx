import { Routes, Route } from "react-router-dom";
import Article from '../pages/article';
import Actu from '../pages/actu';
import Signup from '../pages/signup';


function app(props) {

    return <Routes>
        <Route exact path='/' element={<Actu auth={props.auth} />} />
        <Route path='/article' element={<Article auth={props.auth} />} />
        <Route path='/profile' element={<Signup txtButton={"Modifier mon profil"} auth={props.auth} update={true} />} />
    </Routes>

}

export default app;