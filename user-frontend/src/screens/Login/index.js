import LoginComponent from "../../components/Login";
import { useNavigate } from "react-router-dom";

const Login = props => {
    console.info('screens/Login(props)', props);

    const navigate = useNavigate()

    return (
        
        <main
            className = 'item-main'
            >
            <section
                className = 'theme theme-light'
                style = {{
                    paddingTop: "0px"
                    , paddingBottom: "80px"
                }}
                >
                <div
                    className = { 'max-width' }
                    style = {{ paddingLeft: '0px', paddingRight: '0px' }}
                    >
                    <div
                        //className = 'flex-container'
                        style = {{
                            width: '100%'
                            , maxWidth: "440px"
                            , margin: 'auto'
                        }}
                        >
                        
                        <LoginComponent
                            keyDownUsername = { props.keyDownUsername }
                            keyDownPassword = { props.keyDownPassword }
                            showCloseButton = { false }
                            showLoginDialog = { props.showLoginDialog }
                            isModal = { false }
                            loginPasswordRef = { props.loginPasswordRef }
                            loginFormRef = { props.loginFormRef }
                            loginError = { props.loginError }
                            setLoginError = { props.setLoginError }
                            clickRegister = { props.clickRegister }
                            handleLogin = { props.handleLogin }
                            usernameRef = { props.usernameRef }
                            passwordRef = { props.passwordRef }
                            />
                        
                    </div>
                </div>
            </section>

        </main>
        
    );
};

export default Login;
