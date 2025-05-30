import RegisterComponent from "../../components/Register";

import { useNavigate } from "react-router-dom";

//const Register = () => {
const Register = props => {
    console.info('screens/Register(props)', props);

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
                        style = {{
                            width: '100%'
                            , maxWidth: "440px"
                            , margin: 'auto'
                        }}
                        >
                        
                        <RegisterComponent
                            keyDownUsername = { props.keyDownUsername }
                            keyDownPassword = { props.keyDownPassword }
                            showCloseButton = { false }
                            showLoginDialog = { props.showLoginDialog }
                            isModal = { false }
                            registerUser = { props.registerUser }
                            registerPasswordRef = { props.registerPasswordRef }
                            registerFormRef = { props.registerFormRef }
                            registerError = { props.registerError }
                            setRegisterError = { props.setRegisterError }
                            />
                        
                    </div>
                </div>
            </section>

        </main>
        
    );
};

export default Register;
