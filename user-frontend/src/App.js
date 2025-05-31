import
    React
    , {
          useRef
        , useState
        , useCallback
        , useEffect
    } from "react";

import {
      BrowserRouter as Router
    , Route
    , Routes
    , useNavigate
    , useLocation
    , Link
} from 'react-router-dom';

import styles from "./styles/app.sass";

import Page                      	   	from "./components/Page";
import ReferralLink                     from "./screens/ReferralLink"; // ReferAndEarn renamed to ReferralLink
import ReferredAffiliates               from "./screens/ReferredAffiliates";
import RewardHistory                    from "./screens/RewardHistory";
import Register                         from "./screens/Register";
import Login                            from "./screens/Login";
import Home                             from "./screens/Home";
import UserHome                         from "./screens/UserHome";

import {
    CircularProgress
} from "@mui/material";

import Swal from "sweetalert2";  // SweetAlert for modal dialogs

import {
      base_url
    , PopUpAlert
    , PopUpWarning
    , PopUpWarningThen
    , PopUpConfirmation
} from "./controller/utils";

function App() {
    console.info('App()');
    //console.log('App()');
    
    console.debug("App: process.env.NODE_ENV = ", process.env.NODE_ENV);

    const navigate = useNavigate(); // Error: useNavigate() may be used only in the context of a <Router> component.

    const [referralCode, setReferralCode] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [userAccessToken, setUserAccessToken] = useState(null);
    const registerFormRef = useRef(null);
    const [loginError, setLoginError] = useState({})
    const [registerError, setRegisterError] = useState({})
    const [registerObject, setRegisterObject] = useState({})

    useEffect(() => {
        console.debug('App: useEffect(async() => {...')

        console.debug('    window.location.search = ', window.location.search)
        const queryParameters = new URLSearchParams(window.location.search)
        const referralCode = queryParameters.get('referral-code')
        console.debug('    referralCode = ', referralCode);
        if (referralCode) setReferralCode(referralCode);

    }, []);

    const clickRegister = async function(event) {
        console.debug("clickRegister()", event);

        if (event) {
            console.debug("event.preventDefault = " + event.preventDefault);
            event.preventDefault();
            console.debug("event.stopPropagation = " + event.stopPropagation);
            event.stopPropagation();
        }

        setIsVisibleLoginDialog(false);

        showRegisterDialog();

        return false;
    };

    const keyDownPassword = (e) => {
        console.info('keyDownPassword(e)');

        if (e.key === 'Enter') {
            console.log('e.key = ', e.key);
            console.error(e.key, 'key');
            handleLogin(event);
        }
    };

    const keyDownUsername = (e) => {
        console.log('keyDownUsername(e)');

        if (e.key === 'Enter') {
            console.log('e.key = ', e.key);
            console.error(e.key, 'key');
            handleLogin(event);
        }
    };

    const registerUser = async (event) => {
        console.info('registerUser()', event);

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        console.info('registerFormRef.current = ', registerFormRef.current);
        console.info('event.target = ', event.target);
        console.info('event.target.form = ', event.target?.form);

        // Get the form element        
        //let form = registerFormRef.current;
        //const clickedButton = event.target;
        //const formElement = clickedButton.form;
        let form = event.target?.form;
        console.info('form = ', form);

        let firstNameField = form['firstName'];
        let firstName = firstNameField.value;
        //console.info('firstNameField = ', firstNameField);
        console.info('firstName = ', firstName);

        let lastNameField = form['lastName'];
        let lastName = lastNameField.value;
        console.info('lastName = ', lastName);

        let fieldName = 'username';
        let username = form[fieldName].value;
        console.info('username = ', username);

        fieldName = 'password';
        let password = form[fieldName].value;
        console.info('password = ', password);

        fieldName = 'repeatpassword';
        let repeatPassword = form[fieldName].value;
        console.info('repeatPassword = ', repeatPassword);

        if (!firstName) {
            let registerError = {};
            registerError['firstName'] = 'Please enter your first name';
            setRegisterError(registerError);
            return;
        } else {
            registerError['firstName'] = '';
            delete registerError['firstName'];
            setRegisterError(registerError);
        }

        if (!lastName) {
            let registerError = {};
            registerError['lastName'] = 'Please enter your last name';
            setRegisterError(registerError);
            return;
        } else {
            registerError['lastName'] = '';
            delete registerError['lastName'];
            setRegisterError(registerError);
        }

        if (!username) {
            let registerError = {};
            registerError['username'] = 'Please enter your email address';
            setRegisterError(registerError);
            return;
        } else {
            registerError['username'] = '';
            delete registerError['username'];
            setRegisterError(registerError);
        }

        let message = 'Please enter your password';
        fieldName = 'password';
        if (!password) {
            setRegisterError({ ...registerError, [fieldName]: message });
            console.info('registerError = ', registerError);
            return;
        } else {
            registerError[fieldName] = '';
            delete registerError[fieldName];
            setRegisterError(registerError);
        }

        message = 'Please enter your password again';
        fieldName = 'repeatpassword';
        if (!repeatPassword) {
            setRegisterError({ ...registerError, [fieldName]: message });
            console.info('registerError = ', registerError);
            return;
        } else {
            registerError[fieldName] = '';
            delete registerError[fieldName];
            setRegisterError(registerError);
        }

        if (password !== repeatPassword) {
            PopUpAlert(
                'Alert'
                , 'The passwords do not match.'
                , 'error'
            ).then((result) => {
                // { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                console.info(result);
                console.info("result.isConfirmed = ", result.isConfirmed);
                console.info("result.value = ", result.value);
            });
            return;
        }

        let payload = {
              username: username
            , password: password
            , firstName: firstName
            , lastName: lastName
        };
        if (referralCode) payload.referralCode = referralCode
        console.info('payload = ', payload);

        fetchRegister(payload);
    };

    let fetchRegister = async (bodyObject) => {
        console.info('App: fetchRegister(bodyObject)', bodyObject);

        try {

            let fetchConfig = {
                method: 'POST'
                , headers: {
                      'Accept': '*/*'
                    , 'Content-Type': 'application/json'
                }
                , body: JSON.stringify(bodyObject)
            };
            console.info('fetchConfig = ', fetchConfig);

            let fetchPath = `${ base_url }user/register-user`;
            console.info('fetchPath = ', fetchPath);

            let fetchPromise = fetch(fetchPath, fetchConfig);
            fetchPromise
                .then(function(response) {
                    console.info('response = ', response);
                    console.info('response.ok = ', response.ok);
                    
                    if (response.ok) { // status of 200 signifies sucessful HTTP call, shorthand for checking that status is in the range 200-299 inclusive. Returns a boolean value.
                        //Swal.close();
                        return response.json();
                    } else {
                        //console.info('response.text() = ', response.text());
                        return response.text().then(text => { throw new Error(text) })
                    }
                })

                // { success: true, message: "User Already Exists", result: {…} }
                // { success: false, message: "User Already Exists" }
                .then(function(responseJson) {
                    console.info('responseJson = ', responseJson);

                    if (responseJson) {

                        console.info('responseJson.success = ', responseJson.success);
                        if (responseJson.success) {

                            console.info('responseJson.result = ', responseJson.result);
                            console.info('typeof responseJson.result = ', typeof responseJson.result);

                            setUserDetails(responseJson.result);
                            console.info('userDetails = ', userDetails);

                                if (responseJson.message) {

                                    //PopUpAlert('Success!', responseJson.message, 'success')
                                    /*
                                    PopUpAlert(
                                        //'Success!'
                                        responseJson.message
                                        , 'Please check your email to activate your account.'
                                        , 'success'
                                    );
                                    */
                                    Swal.fire({
                                          //title: 'Success!'
                                          title: responseJson.message
                                        , text: 'You will need to activate your account.'
                                        , icon: 'success'
                                        , customClass: {
                                            confirmButton: 'primary large'
                                        }
                                        , confirmButtonColor: 'var(--color-theme-primary)'
                                        , iconColor: 'var(--color-theme-success)'
                                    }).then((result) => {
                                        // { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                                        console.info(result);
                                        console.info("result.isConfirmed = ", result.isConfirmed);
                                        console.info("result.value = ", result.value);
                                    });
                                }
                            //}

                        } else {

                            Swal.fire({
                                  title: 'Alert!'
                                , text: responseJson.message
                                , icon: 'error'
                                , customClass: {
                                    confirmButton: 'primary large'
                                }
                                , confirmButtonColor: 'var(--color-theme-primary)'
                                , iconColor: 'var(--color-theme-alert)'
                            }).then((result) => {
                                // { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                                console.info(result);
                                console.info("result.isConfirmed = ", result.isConfirmed);
                                console.info("result.value = ", result.value);

                                /*
                                if (result.value) {

                                    //setIsVisibleRegisterDialog(false);
                                    //showLoginDialog();

                                    console.info("usernameValue = ", usernameValue);
                                    console.info("usernameRef = ", usernameRef);
                                    console.info("usernameRef.current = ", usernameRef.current);
                                    usernameRef.current.value = usernameValue;
                                    console.info("usernameRef.current.value = ", usernameRef.current.value);
                                }
                                //*/

                            });
                        }
                    }

                }).catch(err => {

                    console.info(err);
                    console.info('err = ', err);
                    console.info('err.message = ', err.message);
                    console.info('typeof err.message = ', typeof err.message);

                    let errorObject = JSON.parse(err.message);
                    console.info('errorObject = ', errorObject);

                    let sweetAlertConfig = {
                        icon: 'error'
                        , customClass: {
                            confirmButton: 'primary large'
                        }
                        , confirmButtonColor: 'var(--color-theme-primary)'
                        , iconColor: 'var(--color-theme-alert)'
                    };

                    if (errorObject.error && errorObject.message) {
                        if (errorObject.error.length > errorObject.message.length) {
                            sweetAlertConfig.title = errorObject.message
                            sweetAlertConfig.text = errorObject.error
                        } else {
                            sweetAlertConfig.title = errorObject.error
                            sweetAlertConfig.text = errorObject.message
                        }
                    } else if (errorObject.error) {
                        sweetAlertConfig.title = errorObject.message
                        sweetAlertConfig.text = errorObject.error
                    } else {
                        sweetAlertConfig.title = errorObject.message
                    }

                    Swal.fire(sweetAlertConfig).then((result) => {
                        // E.g. { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                        
                        console.info(result);
                        console.info("App: fetchRegister(): Swal.fire({}): result.isConfirmed = ", result.isConfirmed);
                        console.info("App: fetchRegister(): Swal.fire({}): result.value = ", result.value);

                    });

                });

        } catch (err) {

            console.log('err = ', err);
        }

    }; // fetchRegister()

    const handleLogin = async (event) => {
        console.info('handleLogin()', event);

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        //console.info('registerFormRef.current = ', registerFormRef.current);
        console.info('event.target = ', event.target);
        console.info('event.target.form = ', event.target?.form);

        //const clickedButton = event.target;
        //const formElement = clickedButton.form;
        //let form = registerFormRef.current;
        let form = event.target?.form;
        console.info('form = ', form);

        let fieldName = 'username';
        let username = form[fieldName].value;
        console.info('username = ', username);

        fieldName = 'password';
        let password = form[fieldName].value;
        console.info('password = ', password);

        if (!username) {
            let registerError = {};
            registerError['username'] = 'Please enter your email address';
            setRegisterError(registerError);
            return;
        } else {
            registerError['username'] = '';
            delete registerError['username'];
            setRegisterError(registerError);
        }

        let message = 'Please enter your password';
        fieldName = 'password';
        if (!password) {
            setRegisterError({ ...registerError, [fieldName]: message });
            console.info('registerError = ', registerError);
            return;
        } else {
            registerError[fieldName] = '';
            delete registerError[fieldName];
            setRegisterError(registerError);
        }

        fetchLogin({
              email: username
            , password: password
        });
    };

    let fetchLogin = async (bodyObject) => {
        console.info('App: fetchLogin(bodyObject)', bodyObject);

        try {

            const localStorageUserDetails = JSON.parse(localStorage.getItem('USER_DETAILS'));
            console.log('App: fetchLogin(): localStorageUserDetails = ', localStorageUserDetails);
            console.info('bodyObject = ', bodyObject);

            let fetchConfig = {
                //method: 'PATCH'
                method: 'POST'
                , headers: {
                      'Accept': '*/*'
                    , 'Content-Type': 'application/json'
                }
                , body: JSON.stringify(bodyObject)
            };
            console.info('fetchConfig = ', fetchConfig);

            let fetchPath = `${ base_url }user/authenticate`;
            console.info('fetchPath = ', fetchPath);

            let fetchPromise = fetch(fetchPath, fetchConfig);
            fetchPromise.then(function(response) {
                console.info('response = ', response);

                console.info('response.ok = ', response.ok);
                if (response.ok) { // status of 200 signifies sucessful HTTP call, shorthand for checking that status is in the range 200-299 inclusive. Returns a boolean value.
                    //Swal.close();
                    return response.json();
                } else {
                    //console.info('response.text() = ', response.text());

                    return response.text().then(text => { throw new Error(text) })

                    /*
                    let err = 'err';
                    console.info(err);
                    console.info('err = ', err);
                    PopUpAlert('Alert', err.message, 'error');
                    return null;
                    */
                }
            })

            // {"success":false,"message":"Your password is incorrect."}
            .then(function(responseJson) {
                console.info('responseJson = ', responseJson);

                if (responseJson) {

                    console.info('responseJson.result = ', responseJson.result);
                    console.info('typeof responseJson.result = ', typeof responseJson.result);

                    console.info('responseJson.success = ', responseJson.success);

                    //*    
                    //let userdata = res.data?.result;
                    let userdata = responseJson.result;
                    console.log('App: fetchLogin(): post(): userdata = ', userdata);

                    let userAccessToken = userdata?.accessToken;
                    console.log('App: fetchLogin(): post(): userAccessToken = ', userAccessToken);

                    // Set the userAccessToken
                    setUserAccessToken(userAccessToken);
                    localStorage.setItem('USER_ACCESS_TOKEN', userAccessToken);

                    try {

                        let userObject = { userId: userdata?.userId, email: userdata.email };
                        console.log('userObject = ', userObject);

                        setUserDetails(userObject);
                        console.info('userDetails = ', userDetails);

                        let userString =  JSON.stringify(userObject, (key, value) =>
                            typeof value === 'bigint'
                            ? value.toString()
                            : value
                        );
                        console.log('userString = ', userString);

                        localStorage.setItem(
                            'USER_DETAILS'
                            , userString
                        );
                        console.info('App: fetchLogin(): post(): localStorage.getItem(USER_DETAILS) = ', localStorage.getItem('USER_DETAILS'));

                    } catch(err) {
                        console.error(err);
                        console.info('err = ', err);
                        //alert('err = ' + err);
                        //PopUpAlert('Alert', err.message, 'error')
                        //alert('PopUpAlert(err.error, err.message, \'error\')');
                        PopUpAlert(err.error, err.message, 'error')
                    };

                    userAccessToken = localStorage.getItem('USER_ACCESS_TOKEN');
                    //console.log('               userAccessToken.current = ', userAccessToken.current);
                    console.info('App: fetchLogin(): post(): userAccessToken = ', userAccessToken);
                    //alert('App: fetchLogin(): post(): userAccessToken = ' + userAccessToken);

                    if (userAccessToken) goToUserHome();

                } else { // if (responseJson) {                        

                    Swal.fire({
                          title: 'Alert!'
                        , text: responseJson.message
                        , icon: 'error'
                        , customClass: {
                            confirmButton: 'primary large'
                        }
                        , confirmButtonColor: 'var(--color-theme-primary)'
                        , iconColor: 'var(--color-theme-alert)'
                    }).then((result) => {
                        // { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                        console.info(result);
                        console.info("result.isConfirmed = ", result.isConfirmed);
                        console.info("result.value = ", result.value);
                    });
                }

            }).catch(err => {

                console.info('err.message = ', err.message);

                let errorObject = JSON.parse(err.message);
                if (errorObject) {
                    console.info('errorObject = ', errorObject);
                    console.info('errorObject.message = ', errorObject?.message);
                    console.info('errorObject.error = ', errorObject?.error);
                }

                let sweetAlertConfig = {
                    icon: 'error'
                    , customClass: {
                        confirmButton: 'primary large'
                    }
                    , confirmButtonColor: 'var(--color-theme-primary)'
                    , iconColor: 'var(--color-theme-alert)'
                };

                if (errorObject?.error) {
                    sweetAlertConfig.title = errorObject?.message;
                    sweetAlertConfig.text = errorObject?.error;
                } else {
                    //sweetAlertConfig.text = errorObject?.message;
                    sweetAlertConfig.title = errorObject?.message;
                }

                Swal.fire(sweetAlertConfig).then((result) => {
                    // E.g. { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                    
                    console.info(result);
                    console.info("App: fetchLogin(): Swal.fire({}): result.isConfirmed = ", result.isConfirmed);
                    console.info("App: fetchLogin(): Swal.fire({}): result.value = ", result.value);

                    if (result.value) {

                    }
                });
            });

        } catch (err) {

            console.log('err = ', err);
            Swal.hideLoading()

        }

    }; // fetchLogin()

    const logoutUser = async () => {
        console.debug('logoutUser()');

        setUserAccessToken(null);

        localStorage.removeItem('USER_ACCESS_TOKEN');
        PopUpConfirmation('Success', 'User Logged Out', 'success').then(function() { window.location.href = '/' });

        setTimeout(() => {
            window.location.href = '/'
        }, 2000);
    };

    const loginRegisterFunctions = {
        logoutUser: logoutUser
    };

    const goToHome = () => {
        navigate('/home'); // Navigate to the /home route
    };

    const goToUserHome = () => {
        navigate('/user'); // Navigate to the /home route
    };

    return (

        <>

            <Routes>

                <Route
                    exact path = "/"
                    element = {
                        userAccessToken == null
                        ? <Home
                            isHomePage = { true }
                            userDetails = { userDetails }
                            //loginRegisterFunctions = { loginRegisterFunctions }
                            />
                        : <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            ><UserHome /></Page>
                    }
                />

                <Route
                    exact path = "/user"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            ><UserHome
                                userDetails = { userDetails }
                                loginRegisterFunctions = { loginRegisterFunctions }
                                /></Page>
                    }
                />

                <Route
                    exact path = "/register"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <Register
                                showCloseButton = { false }
                                keyDownUsername = { keyDownUsername }
                                keyDownPassword = { keyDownPassword }
                                registerUser = { registerUser }
                                registerFormRef = { registerFormRef }
                                registerError = { registerError }
                                setRegisterError = { setRegisterError }
                                />
                        </Page>
                    } />

                <Route
                    exact path = "/login"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <Login
                                showCloseButton = { false }
                                keyDownUsername = { keyDownUsername }
                                keyDownPassword = { keyDownPassword }
                                registerUser = { registerUser }
                                registerFormRef = { registerFormRef }
                                registerError = { registerError }
                                setLoginError = { setLoginError }
                                clickRegister = { clickRegister }
                                handleLogin = { handleLogin }
                                />
                        </Page>
                    } />

                <Route
                    exact path = "/my-referral-link"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <ReferralLink
                                userDetails = { userDetails }
                                loginRegisterFunctions = { loginRegisterFunctions }
                                />
                        </Page>
                    } />
                
                <Route
                    exact path = "/referred-affiliates"
                    //render = { () => (
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <ReferredAffiliates
                                userDetails = { userDetails }
                                />
                        </Page>
                    } />

                <Route
                    exact path = "/reward-history"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <RewardHistory
                                userDetails = { userDetails }
                                />
                        </Page>
                    } />

            </Routes>

        </>
    );
}

export default App;
