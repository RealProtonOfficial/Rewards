import React, { useEffect, useState, useRef } from "react";
import {
    useLocation
} from "react-router-dom";
import styles from "./Page.module.sass";
import Header from "../Header";
import Footer from "../Footer";
import axios from 'axios';
import { NAMES_CONSTANTS } from '../../constants';

const Page = (props) => {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const userProfileMenuRef = useRef(null);
    const userProfileButtonRef = useRef(null);

    const userAccessToken = localStorage.getItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN);
    //console.debug('Page: userAccessToken = ', userAccessToken);
    const [walletDetails, setWalletDetails] = useState(localStorage.getItem(NAMES_CONSTANTS.USER_WALLET_DETAILS));
    //console.debug('Page: walletDetails = ', walletDetails);


    return (
        <>

            <Header
                className = "light"
                loginRegisterFunctions = { props.loginRegisterFunctions }
                userDetails = { props.userDetails }
                />

            { props.children }

            <Footer />

        </>
    );
};

export default Page;