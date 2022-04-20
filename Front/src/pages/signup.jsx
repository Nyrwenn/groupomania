import logoLine from '../assets/icon-left-font2.png';
import '../components/login.scss';
import '../pages/signup.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';
import axios from 'axios';
import avatarExple from '../assets/avatar-de-lutilisateur.png';
import FormData from 'form-data';
import { useNavigate } from 'react-router';
import { putProfile, postProfile, getProfile, delProfile } from "../utils/path";



function Signup(props) {
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [filePicture, setFilePicture] = useState(null);
    const [changePicture, setChangePiture] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [firstnameErr, setFirstnameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [pswdErr, setPswdErr] = useState(false);
    const navigate = useNavigate();
    const regexName = /(^.{1,}[a-zA-ZÀ-ÿ]+$)/;
    const regexEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
    const regexPswd = /^[a-zA-Z0-9]{8,30}$/;
    const validate = () => {
        if (!regexName.test(name)) {
            setNameErr(true);
        }
        if (!regexName.test(firstname)) {
            setFirstnameErr(true);
        }

        if (!regexEmail.test(email)) {
            setEmailErr(true);
        }

        if (!regexPswd.test(password)) {
            setPswdErr(true);
        }
    }


    const sendChecker = (e) => {
        e.preventDefault();
        const data = {
            avatar: filePicture,
            profile: {
                name: name,
                firstname: firstname,
                email: email,
                password: password
            }

        };



        if (props.auth) {
            if (changePicture) {

                const dataSend = new FormData();
                //console.log(data);
                dataSend.append(
                    "image",
                    e.target.avatar.files[0],
                    e.target.avatar.files[0].name


                );
                dataSend.set("profile", JSON.stringify(data.profile));

                console.log(props.auth)
                const config = {
                    headers: {
                        'Content-Type': `multipart/form-data`,
                        Authorization: `Bearer ${props.auth.token}`
                    }
                };

                axios.put(putProfile + props.auth.userId, dataSend, config)
                    .then(function (res) {
                        navigate('/');
                        console.log(res);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                const config = {
                    headers: {
                        Authorization: `Bearer ${props.auth.token}`
                    }
                };

                axios.put(putProfile + props.auth.userId, data.profile, config)
                    .then(function (res) {
                        navigate('/');
                        console.log(res);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }

        } else {
            if (changePicture) {
                const dataSend = new FormData();
                //console.log(data);
                dataSend.append(
                    "image",
                    e.target.avatar.files[0],
                    e.target.avatar.files[0].name


                );
                dataSend.set("profile", JSON.stringify(data.profile));
                axios.post(postProfile, dataSend, {
                    headers: {
                        'Content-Type': `multipart/form-data`,
                    }
                })
                    .then(function (res) {
                        navigate('/');

                        console.log(res);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                axios.post(postProfile, data.profile)
                    .then(function (res) {
                        navigate('/');
                        console.log(res);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }

    }
    useEffect(() => {
        if (props.auth) {
            const config = {
                headers: { Authorization: `Bearer ${props.auth.token}` }
            };
            axios.get(getProfile + props.auth.userId, config)
                .then((res) => {
                    //console.log(res.data)
                    setFilePicture(res.data.avatar)
                    setName(res.data.name)
                    setFirstname(res.data.firstname)
                    setEmail(res.data.email)
                })
                .catch((error) => console.log('ici erreur', error))
        }
    }, [props.auth])

    const deleteProfile = () => {
        const config = {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        };

        axios.delete(delProfile + props.auth.userId, config)
            .then((res) => {
                console.log(res)
                localStorage.removeItem('JWT');
                navigate('/');
                window.location.reload();

            })
            .catch((error) => console.log(error))


    }


    return <div className="profilWrapper">
        <Link to="/"><header className="logoContainer">
            <img id="logo_row" src={logoLine} alt="Logo Groupomania" />
        </header></Link>
        {
            props.update &&
            <div style={{ width: "95%", display: "flex", justifyContent: "flex-end" }}><button id="btnConnexion" className="deleteProfile" style={{ marginTop: "0px" }} onClick={() => deleteProfile()}>Supprimer le profil</button></div>

        }
        <form className="form_Signup" onSubmit={(e) => sendChecker(e)}>
            <div className="avatar_container">
                <div className="circle"
                    style={{
                        backgroundImage: `url(${filePicture ? filePicture : avatarExple})`,
                        backgroundSize: "cover"
                    }}
                ></div>
                <label htmlFor="avatar" className="avatar_title" name="avatar"><FontAwesomeIcon icon={faCamera} size="xl" style={{ color: "#FD2D01", marginRight: "20px", marginLeft: "5px" }} />Choisissez votre avatar
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg, image/jpg" onChange={(e) => {
                        setFilePicture(URL.createObjectURL(e.target.files[0]))
                        setChangePiture(true)
                    }
                    } />
                </label>
            </div>
            <div className="form_row">
                <label htmlFor="name" className="txt_Signup">Nom</label>
                <input type="text" id="name" className="inputs" name="name" required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            {nameErr && <p className="alert">Veuillez saisir un nom valide (min 3 caratères, pas de chiffres).</p>}
            <div className="form_row">
                <label htmlFor="firstname" className="txt_Signup">Prénom</label>
                <input type="text" id="firstname" className="inputs" name="firstname" required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </div>
            {firstnameErr && <p className="alert">Veuillez saisir un prénom valide (min 3 caractères, pas de chiffres).</p>}
            <div className="form_row">
                <label htmlFor="email" className="txt_Signup">Email</label>
                <input type="email" id="email" className="inputs" name="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            {emailErr && <p className="alert">Veuillez saisir un email au format valide.</p>}
            <div className="form_row">
                <label htmlFor="password" className="txt_Signup">Mot de passe</label>
                <input type="password" id="password" className="inputs" name="password" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {pswdErr && <p className="alert">Votre mot de passe doit contenir minimum 8 caractères.</p>}
            <input id="btnConnexion" type="submit" value={props.txtButton} onClick={validate} />
        </form>
    </div>
}

export default Signup;