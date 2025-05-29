import
    React
    , {
          useRef
        , useState
    } from "react";

import {
      useNavigate
    , useLocation
    , Link
} from 'react-router-dom';

import cn from "classnames";

import Icon from "../Icon";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = props => {
    console.warn('Login()', props);


    let index = props.index;
    let assetObject = props.assetObject;
    let categoryName = props.categoryName;
    let clickSearchResult = props.clickSearchResult;
    let handleCloseLoginDialog = props.handleCloseLoginDialog;
    let keyDownUsername = props.keyDownUsername;
    let usernameRef = props.usernameRef;
    let passwordRef = props.passwordRef;
    let keyDownPassword = props.keyDownPassword;
    let handleLogin = props.handleLogin;
    let loginError = props.loginError;

    const [loginPasswordVisibility, setLoginPasswordVisibility] = useState(false);

    const handleChangeLoginPasswordVisibility = () => {
        setLoginPasswordVisibility(!loginPasswordVisibility);
    };

    return (

        <>

        <form
            ref = { props.registerFormRef }
            style = {{ width: '100%' }}
            >

        <div
            //style = {{ border: 'red 3px solid' }}
            >

            {
                props.showCloseButton
                && <div
                    style = {{
                          textAlign: 'right'
                        , marginRight: '0'
                        , position: 'relative'
                        //, border: 'blue 3px solid'
                    }}
                    >
                    <button
                        //className = { styles.close }
                        className = 'close'
                        onClick = { handleCloseLoginDialog }
                        style = {{
                            position: 'absolute'
                            //, border: 'green 3px solid'
                        }}
                        >
                        <Icon name="close" size="14" />
                    </button>
                </div>
            }

            <h3
                style = {{ 
                      textAlign: 'left'
                    , fontSize: '40px'
                    , fontWeight: 600
                }}
                >
                Sign In
            </h3>
            <p
                className="title"
                style = {{
                    textAlign: 'left'
                    , fontSize: 16
                    , marginTop: 10
                    , fontWeight: 500
                    , color: '#777E90'
                }}>
                Enter your credentials to log in to your account.
            </p>

            <div className = { "editable" } style = {{ marginBlock: 20 }}>
                <div className = { "input-box" } style = {{ marginBottom: 8 }}>
                    <input
                        type = "text"
                        name = "username"
                        //value = 'service.account@wearefuturetech.com'
                        ref = { usernameRef }
                        style = {{ width: '100%' }}
                        placeholder = "name@email.com"
                        onKeyDown = {(e) => keyDownUsername(e)}
                        />
                </div>

                    <div
                        className = { "input-box" }
                        style = {{ whiteSpace: 'nowrap' }}
                        >
                        <input
                            type = { loginPasswordVisibility ? "text" : "password" }
                            ref = { passwordRef }
                            style = {{ width: '100%', display: "inline-block" }}
                            name = "password"
                            placeholder = "**********"
                            onKeyDown = { (e) => keyDownPassword(e) }
                            />
                            {
                                loginPasswordVisibility
                                ? (
                                    <VisibilityIcon
                                        style={{ margin: "0px 8px 0px -32px" }}
                                        onClick={() => handleChangeLoginPasswordVisibility()}
                                        />
                                ) : (
                                    <VisibilityOffIcon
                                        style={{ margin: "0px 8px 0px -32px" }}
                                        onClick={() => handleChangeLoginPasswordVisibility()}
                                        />
                                )
                            }
                    </div>

                {
                    loginError?.username
                    &&
                    <div>
                        <div
                            //className = { styles.errorMsg }
                            className = 'errorMsg'
                            >{ loginError?.username }</div>
                    </div>
                }

            </div>

            <button
                className = 'primary'
                style = {{ marginBottom: 10 }}
                //onClick = { handleLogin }
                onClick = { (event) => props.handleLogin2(event) }
                >
                Log In
            </button>
          
        </div>

        <div style = {{ paddingTop: '18px' }}>

            <span
                style = {{
                      fontSize: '1.25em'
                    , padding: '0px 7px'
                }}
                >|</span>

            <Link
                to = '/register'
                //onClick = { (event) => {
                //    event.preventDefault();
                //    props.clickRegister(event);
                //}}
                style = {{
                    textDecoration: 'underline'
                    , fontSize: '1.1em'
                }}
                >Create Account</Link>

        </div>

        </form>
        </>
    );
}

export default Login;
