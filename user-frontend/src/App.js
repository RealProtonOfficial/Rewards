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

import {
    useDispatch
    , useSelector
} from 'react-redux';

import { referralCodeUpdate }           from "./redux/keySlice";

import Page                      	   	from "./components/Page";
import ReferralLink                     from "./screens/ReferralLink"; // ReferAndEarn renamed to ReferralLink
import ReferredAffiliates               from "./screens/ReferredAffiliates";
import RewardHistory                    from "./screens/RewardHistory";

import {
    CircularProgress
} from "@mui/material";

function App() {
    console.info('App()');
    //console.log('App()');
    
    console.debug("App: process.env.NODE_ENV = ", process.env.NODE_ENV);

    const navigate = useNavigate(); // Error: useNavigate() may be used only in the context of a <Router> component.
    const dispatch = useDispatch();

    useEffect(() => {
        console.debug('App: useEffect(async() => {...')

        console.debug('    window.location.search = ', window.location.search)
        const queryParameters = new URLSearchParams(window.location.search)
        const referralCode = queryParameters.get('referral-code')
        console.debug('    referralCode = ', referralCode);
        if (referralCode) dispatch(referralCodeUpdate(referralCode));

    }, []);

    const referralCode = useSelector((state)=> state?.keyVal?.referralCode);
    console.debug('App: referralCode = ', referralCode);

    return (

        <>

            {
                loading 
                ? <div id="preload">
                      <CircularProgress />
                  </div>
                : null
            }

            <Routes>

                <Route
                    exact path = "/my-referral-link"
                    //render = { () => (
                    element = {
                        <Page
                            chooseWalletType = { chooseWalletType }
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            cartCount = { cartCount }
                            >
                            <ReferralLink />
                        </Page>
                    } /> {/* Renamed from path = "/refer-and-earn" <Page><ReferAndEarn /></Page> */}
                
                <Route
                    exact path = "/referred-affiliates"
                    //render = { () => (
                    element = {
                        <Page
                            chooseWalletType = { chooseWalletType }
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            cartCount = { cartCount }
                            >
                            <ReferredAffiliates
                                chooseWalletType = { chooseWalletType }
                                userDetails = { userDetails }
                                />
                        </Page>
                    } />

                <Route
                    exact path = "/reward-history"
                    //render = { () => (
                    element = {
                        <Page
                            chooseWalletType = { chooseWalletType }
                            userDetails = { userDetails }
                            loginRegisterFunctions = { loginRegisterFunctions }
                            cartCount = { cartCount }
                            >
                            <RewardHistory />
                        </Page>
                    } />

            </Routes>

        </>
    );
}

export default App;
