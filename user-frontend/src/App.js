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
import Home                            from "./screens/Home";

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
        console.warn('keyDownPassword(e)');

        if (e.key === 'Enter') {
            console.log('e.key = ', e.key);
            console.error(e.key, 'key');
            handleLogin();
        }
    };

    const keyDownUsername = (e) => {
        console.log('keyDownUsername(e)');

        if (e.key === 'Enter') {
            console.log('e.key = ', e.key);
            console.error(e.key, 'key');

            if (isValidatedUser) {
                handleLogin();
            } else {
                validateUserExist();
            }
        }
    };

    const registerUser = async (event) => {
        console.warn('registerUser()', event);

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        console.warn('registerFormRef.current = ', registerFormRef.current);
        console.warn('event.target = ', event.target);
        console.warn('event.target.form = ', event.target?.form);

        // Get the form element        
        //let form = registerFormRef.current;
        //const clickedButton = event.target;
        //const formElement = clickedButton.form;
        let form = event.target?.form;
        console.warn('form = ', form);

        let firstNameField = form['firstName'];
        let firstName = firstNameField.value;
        //console.warn('firstNameField = ', firstNameField);
        console.warn('firstName = ', firstName);

        let lastNameField = form['lastName'];
        let lastName = lastNameField.value;
        console.warn('lastName = ', lastName);

        let fieldName = 'username';
        let username = form[fieldName].value;
        console.warn('username = ', username);

        fieldName = 'password';
        let password = form[fieldName].value;
        console.warn('password = ', password);

        fieldName = 'repeatpassword';
        let repeatPassword = form[fieldName].value;
        console.warn('repeatPassword = ', repeatPassword);

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
            console.warn('registerError = ', registerError);
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
            console.warn('registerError = ', registerError);
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
                console.warn(result);
                console.warn("result.isConfirmed = ", result.isConfirmed);
                console.warn("result.value = ", result.value);
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
        console.warn('payload = ', payload);

        fetchRegister(payload);
    };

    let fetchRegister = async (bodyObject) => {
        console.warn('App: fetchRegister(bodyObject)', bodyObject);

        try {

            let fetchConfig = {
                method: 'POST'
                , headers: {
                      'Accept': '*/*'
                    , 'Content-Type': 'application/json'
                }
                , body: JSON.stringify(bodyObject)
            };
            console.warn('fetchConfig = ', fetchConfig);

            let fetchPath = `${ base_url }user/register-user`;
            console.warn('fetchPath = ', fetchPath);

            let fetchPromise = fetch(fetchPath, fetchConfig);
            fetchPromise
                .then(function(response) {
                    console.warn('response = ', response);
                    console.warn('response.ok = ', response.ok);
                    
                    if (response.ok) { // status of 200 signifies sucessful HTTP call, shorthand for checking that status is in the range 200-299 inclusive. Returns a boolean value.
                        //Swal.close();
                        handleCloseRegisterDialog();
                        return response.json();
                    } else {
                        //console.warn('response.text() = ', response.text());
                        return response.text().then(text => { throw new Error(text) })
                    }
                })

                // { success: true, message: "User Already Exists", result: {…} }
                // { success: false, message: "User Already Exists" }
                .then(function(responseJson) {
                    console.warn('responseJson = ', responseJson);

                    if (responseJson) {

                        console.warn('responseJson.success = ', responseJson.success);
                        if (responseJson.success) {

                            setIsRegisteredUser(true);
                            console.warn('isRegisteredUser = ', isRegisteredUser);

                            console.warn('responseJson.result = ', responseJson.result);
                            console.warn('typeof responseJson.result = ', typeof responseJson.result);

                            setUserDetails(responseJson.result);
                            console.warn('userDetails = ', userDetails);

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
                                        , text: 'Please check your email to activate your account.'
                                        , icon: 'success'
                                        , customClass: {
                                            confirmButton: 'primary large'
                                        }
                                        , confirmButtonColor: 'var(--color-theme-primary)'
                                        , iconColor: 'var(--color-theme-success)'
                                    }).then((result) => {
                                        // { isConfirmed: true, isDenied: false, isDismissed: false, value: true }
                                        console.warn(result);
                                        console.warn("result.isConfirmed = ", result.isConfirmed);
                                        console.warn("result.value = ", result.value);
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
                                console.warn(result);
                                console.warn("result.isConfirmed = ", result.isConfirmed);
                                console.warn("result.value = ", result.value);

                                /*
                                if (result.value) {

                                    //setIsVisibleRegisterDialog(false);
                                    //showLoginDialog();

                                    console.warn("usernameValue = ", usernameValue);
                                    console.warn("usernameRef = ", usernameRef);
                                    console.warn("usernameRef.current = ", usernameRef.current);
                                    usernameRef.current.value = usernameValue;
                                    console.warn("usernameRef.current.value = ", usernameRef.current.value);
                                }
                                //*/

                            });
                        }
                    }

                }).catch(err => {

                    console.warn(err);
                    console.warn('err = ', err);
                    console.warn('err.message = ', err.message);
                    console.warn('typeof err.message = ', typeof err.message);

                    let errorObject = JSON.parse(err.message);
                    console.warn('errorObject = ', errorObject);

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
                        
                        console.warn(result);
                        console.warn("App: fetchRegister(): Swal.fire({}): result.isConfirmed = ", result.isConfirmed);
                        console.warn("App: fetchRegister(): Swal.fire({}): result.value = ", result.value);

                    });

                });

        } catch (err) {

            console.log('err = ', err);
        }

    }; // fetchRegister()

    const handleLogin = async (event) => {
        console.warn('handleLogin()', event);

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }

        //console.warn('registerFormRef.current = ', registerFormRef.current);
        console.warn('event.target = ', event.target);
        console.warn('event.target.form = ', event.target?.form);

        //const clickedButton = event.target;
        //const formElement = clickedButton.form;
        //let form = registerFormRef.current;
        let form = event.target?.form;
        console.warn('form = ', form);

        let fieldName = 'username';
        let username = form[fieldName].value;
        console.warn('username = ', username);

        fieldName = 'password';
        let password = form[fieldName].value;
        console.warn('password = ', password);

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
            console.warn('registerError = ', registerError);
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
        console.warn('App: fetchLogin(bodyObject)', bodyObject);

        try {

            let localStorageKeyName = NAMES_CONSTANTS.USER_WALLET_DETAILS;
            console.log('App: fetchLogin(): localStorageKeyName = ', localStorageKeyName);

            let localStorageKeyNameUserAccessToken = NAMES_CONSTANTS.USER_ACCESS_TOKEN;
            console.log('App: fetchLogin(): localStorageKeyNameUserAccessToken = ', localStorageKeyNameUserAccessToken);

            const localStorageUserDetails = JSON.parse(localStorage.getItem(localStorageKeyName));
            console.log('App: fetchLogin(): localStorageUserDetails = ', localStorageUserDetails);
            console.warn('bodyObject = ', bodyObject);

            let fetchConfig = {
                //method: 'PATCH'
                method: 'POST'
                , headers: {
                      'Accept': '*/*'
                    , 'Content-Type': 'application/json'
                }
                , body: JSON.stringify(bodyObject)
            };
            console.warn('fetchConfig = ', fetchConfig);

            let fetchPath = `${ base_url }user/authenticate?type=METAKEEP`;
            console.warn('fetchPath = ', fetchPath);

            let fetchPromise = fetch(fetchPath, fetchConfig);
            fetchPromise.then(function(response) {
                console.warn('response = ', response);

                console.warn('response.ok = ', response.ok);
                if (response.ok) { // status of 200 signifies sucessful HTTP call, shorthand for checking that status is in the range 200-299 inclusive. Returns a boolean value.
                    //Swal.close();
                    handleCloseLoginDialog();
                    return response.json();
                } else {
                    //console.warn('response.text() = ', response.text());

                    return response.text().then(text => { throw new Error(text) })

                    /*
                    let err = 'err';
                    console.warn(err);
                    console.warn('err = ', err);
                    PopUpAlert('Alert', err.message, 'error');
                    return null;
                    */
                }
            })

            // {"success":false,"message":"Your password is incorrect."}
            .then(function(responseJson) {
                console.warn('responseJson = ', responseJson);

                if (responseJson) {

                    console.warn('responseJson.result = ', responseJson.result);
                    console.warn('typeof responseJson.result = ', typeof responseJson.result);

                    console.warn('responseJson.success = ', responseJson.success);

                    //*    
                    //let userdata = res.data?.result;
                    let userdata = responseJson.result;
                    console.log('App: fetchLogin(): post(): userdata = ', userdata);

                    let userAccessToken = userdata?.accessToken;
                    console.log('App: fetchLogin(): post(): userAccessToken = ', userAccessToken);

                    localStorage.setItem(localStorageKeyNameUserAccessToken, userAccessToken);

                    try {

                        let userWalletObject = { userId: userdata?.userId, email: userdata.email };
                        console.log('userWalletObject = ', userWalletObject);

                        let userWalletString =  JSON.stringify(userWalletObject, (key, value) =>
                            typeof value === 'bigint'
                            ? value.toString()
                            : value
                        );
                        console.log('userWalletString = ', userWalletString);

                        localStorage.setItem(
                            NAMES_CONSTANTS.USER_WALLET_DETAILS
                            //, JSON.stringify({ accounts, balance, userId: userdata?.userId, email: userdata.email })
                            //, JSON.stringify(userWalletObject)
                            , userWalletString
                        );
                        console.warn('App: fetchLogin(): post(): localStorage.getItem('+NAMES_CONSTANTS.USER_WALLET_DETAILS+') = ', localStorage.getItem(NAMES_CONSTANTS.USER_WALLET_DETAILS));

                    } catch(err) {
                        console.error(err);
                        console.warn('err = ', err);
                        //alert('err = ' + err);
                        //PopUpAlert('Alert', err.message, 'error')
                        //alert('PopUpAlert(err.error, err.message, \'error\')');
                        PopUpAlert(err.error, err.message, 'error')
                    };

                    userAccessToken = localStorage.getItem(localStorageKeyNameUserAccessToken);
                    //console.log('               userAccessToken.current = ', userAccessToken.current);
                    console.warn('App: fetchLogin(): post(): userAccessToken = ', userAccessToken);
                    //alert('App: fetchLogin(): post(): userAccessToken = ' + userAccessToken);

                    if (userAccessToken) getProfileDetailsAndRerouteUser();

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
                        console.warn(result);
                        console.warn("result.isConfirmed = ", result.isConfirmed);
                        console.warn("result.value = ", result.value);
                    });
                }

            }).catch(err => {

                console.warn('err.message = ', err.message);

                let errorObject = JSON.parse(err.message);
                if (errorObject) {
                    console.warn('errorObject = ', errorObject);
                    console.warn('errorObject.message = ', errorObject?.message);
                    console.warn('errorObject.error = ', errorObject?.error);
                }

                setIsSecondaryModalDialogShowing(true); // This gets set so that the outsideClickHandler in the Login Modal Dialog doesn't close the Login Modal when clicking the OK button on the "Successful Login Modal".

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
                    
                    console.warn(result);
                    console.warn("App: fetchLogin(): Swal.fire({}): result.isConfirmed = ", result.isConfirmed);
                    console.warn("App: fetchLogin(): Swal.fire({}): result.value = ", result.value);

                    setIsSecondaryModalDialogShowing(false); // This gets unset so that the outsideClickHandler on the Register Modal Dialog can hide the Login Modal.

                    if (result.value) {

                    }
                });
            });

        } catch (err) {

            console.log('err = ', err);
            Swal.hideLoading()

        }

    }; // fetchLogin()

    return (

        <>

            <Routes>

                <Route
                    exact path = "/"
                    element = {
                        <Home
                            isHomePage = { true }
                            userDetails = { userDetails }
                            //loginRegisterFunctions = { loginRegisterFunctions }
                            />
                    }
                />

                <Route
                    exact path = "/register"
                    element = {
                        <Page
                            userDetails = { userDetails }
                            //loginRegisterFunctions = { loginRegisterFunctions }
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
                            //loginRegisterFunctions = { loginRegisterFunctions }
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
                            //loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <ReferralLink />
                        </Page>
                    } />
                
                <Route
                    exact path = "/referred-affiliates"
                    //render = { () => (
                    element = {
                        <Page
                            userDetails = { userDetails }
                            //loginRegisterFunctions = { loginRegisterFunctions }
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
                            //loginRegisterFunctions = { loginRegisterFunctions }
                            >
                            <RewardHistory />
                        </Page>
                    } />

            </Routes>

        </>
    );
}

export default App;
