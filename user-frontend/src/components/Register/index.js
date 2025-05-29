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

const Register = props => {
    console.warn('Register()', props);

    let index = props.index;
    let assetObject = props.assetObject;
    let handleLogin = props.handleLogin;
    let registerError = props.registerError;
    let registerObject = props.registerObject;
    let handleChangeRegisterPassword = props.handleChangeRegisterPassword;

    const [registerPasswordVisibility, setRegisterPasswordVisibility] = useState(false);
    const [repeatRegisterPasswordVisibility, setRepeatRegisterPasswordVisibility] = useState(false);

    const handleChangeRegisterPasswordVisibility = () => {
        setRegisterPasswordVisibility(!registerPasswordVisibility);
    };

    const handleChangeRepeatRegisterPasswordVisibility = () => {
        setRepeatRegisterPasswordVisibility(!repeatRegisterPasswordVisibility);
    };

    return (

        <>

        <form
            ref = { props.registerFormRef }
            style = {{ width: '100%' }}
            >

            <div>

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
                            onClick = { handleCloseRegisterDialog }
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
                    Register
                </h3>

                <div className = { "editable" } style = {{ marginBlock: 20 }}>

                    <div style = {{ marginBottom: 8 }}>
                        <div className = { "input-box" } style = {{ marginBottom: 8 }}>
                            <input
                                type = "text"
                                name = "firstName"
                                style = {{ width: '100%' }}
                                placeholder = "First Name"
                                />
                        </div>
                        <div>
                            {
                                registerError?.firstName
                                && <div
                                    className = 'error-msg'
                                    >{ registerError?.firstName }</div>
                            }
                        </div>
                    </div>

                    <div style = {{ marginBottom: 8 }}>
                        <div className = { "input-box"} style = {{ marginBottom: 8 }}>
                            <input
                                type = "text"
                                name = "lastName"
                                style = {{ width: '100%' }}
                                placeholder = "Last Name"
                                />
                        </div>
                        <div>
                            {
                                registerError?.lastName
                                && <div
                                    className = 'error-msg'
                                    >{ registerError?.lastName }</div>
                            }
                        </div>
                    </div>
                    
                    <div style = {{ marginBottom: 8 }}>
                        <div className = { "input-box"}>
                            <input
                                type = "text"
                                name = "username"
                                //value = 'service.account@wearefuturetech.com'
                                style = {{ width: '100%' }}
                                placeholder = "name@email.com"
                                onKeyDown = {(e) => props.keyDownUsername(e)}
                                value =  { registerObject?.username }
                                onChange = { handleChangeRegisterPassword }
                                />
                        </div>
                        <div>
                            {
                                registerError?.username
                                && <div
                                    //className = { styles.errorMsg }
                                    className = 'error-msg'
                                    >{ registerError?.username }</div>
                            }
                        </div>
                    </div>

                    <div style = {{ marginBottom: 8 }}>
                        <div className = { "input-box" }>
                            <input
                                type = { registerPasswordVisibility ? "text" : "password" }
                                style = {{ width: '100%' }}
                                //name = "registerpassword"
                                name = "password"
                                onChange = { handleChangeRegisterPassword }
                                //value = ''
                                //value =  { registerObject?.registerpassword }
                                value =  { registerObject?.password }
                                //placeholder="**********"
                                placeholder="Enter a password"
                                onKeyDown={(e) => props.keyDownPassword(e)}
                                />
                                {
                                    registerPasswordVisibility
                                    ? (
                                        <VisibilityIcon
                                            style={{ margin: "0px 8px 0px -32px" }}
                                            onClick={() => handleChangeRegisterPasswordVisibility()}
                                            />
                                    ) : (
                                        <VisibilityOffIcon
                                            style={{ margin: "0px 8px 0px -32px" }}
                                            onClick={() => handleChangeRegisterPasswordVisibility()}
                                            />
                                    )
                                }
                        </div>

                        <div>
                            {
                                registerError?.password
                                && <div
                                    className = 'error-msg'
                                    >{ registerError?.password }</div>
                            }
                        </div>
                    </div>

                    <div
                        style = {{ marginBottom: 8 }}
                        >

                        <div className = { "input-box" } style={{marginTop: 8}}>
                            <input
                                //type = "password"
                                type = { repeatRegisterPasswordVisibility ? "text" : "password" }
                                style = {{ width: '100%' }}
                                name = "repeatpassword"
                                value =  { registerObject?.repeatpassword }
                                onChange = { handleChangeRegisterPassword }
                                //onChange = { handleChangeRepeatPassword }
                                //value = ''
                                //placeholder = "**********"
                                placeholder="Repeat the password"
                                //onKeyDown={(e) => keyDownPassword(e)}
                                />
                                {
                                    repeatRegisterPasswordVisibility
                                    ? (
                                        <VisibilityIcon
                                            style={{ margin: "0px 8px 0px -32px" }}
                                            onClick={() => handleChangeRepeatRegisterPasswordVisibility()}
                                            />
                                    ) : (
                                        <VisibilityOffIcon
                                            style={{ margin: "0px 8px 0px -32px" }}
                                            onClick={() => handleChangeRepeatRegisterPasswordVisibility()}
                                            />
                                    )
                                }
                        </div>
                        <div>
                            {
                                registerError?.repeatpassword
                                && <div
                                    className = 'error-msg'
                                    >{ registerError?.repeatpassword }</div>
                            }
                        </div>
                    </div>

                </div>

                <button
                    className = 'primary'
                    style = {{ marginBottom: 10 }}
                    //onClick = { props.registerUser }
                    onClick = { (event) => props.registerUser(event) }
                    >
                    Continue
                </button>

            </div>

            <div style = {{ paddingTop: '18px' }}>
                <div
                    style = {{ paddingRight: '20px', fontSize: '.9em' }}
                    >
                    Already a member? <Link
                        style = {{
                            textDecoration: 'underline'
                            , fontSize: '1.2em'
                            , paddingLeft: '8px'
                        }}
                        onClick = { props.showLoginDialog }
                        >
                        Log In
                    </Link>
                </div>
            </div>

        </form>

        </>
    );
}

export default Register;
