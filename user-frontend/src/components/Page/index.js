import React, { useEffect, useState, useRef } from "react";
import {
    useLocation
} from "react-router-dom";
import styles from "./Page.module.sass";
import Header from "../Header";
import Footer from "../Footer";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setEuroValue } from "../../redux/counterSlice";
import { axiosInstance } from "../../utils/API";
import { keyDetails } from "../../redux/keySlice";
import {apiCall} from '../../controller/utils'
import { NAMES_CONSTANTS } from '../../constants';
import MobileNav from '../Header/MobileNav';
import MobileUserHeader from '../Header/MobileUserHeader';
import UserProfileMenu from '../Header/UserHeader/UserProfileMenu.js';
import { getPagePosition, getFixedPosition } from '../../utils/UserInterface';
import OutsideClickHandler from "react-outside-click-handler";

const Page = (props) => {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        //clearAllBodyScrollLocks();
    }, [pathname]);

    const dispatch = useDispatch();

    const userProfileMenuRef = useRef(null);
    const userProfileButtonRef = useRef(null);

    const [isShowMobileNav, setIsShowMobileNav] = useState(false);
    const [isShowMobileUserHeader, setIsShowMobileUserHeader] = useState(false);
    const [isShowUserProfileMenu, setIsShowUserProfileMenu] = useState(false);

    const userAccessToken = localStorage.getItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN);
    //console.debug('Page: userAccessToken = ', userAccessToken);
    const [walletDetails, setWalletDetails] = useState(localStorage.getItem(NAMES_CONSTANTS.USER_WALLET_DETAILS));
    //console.debug('Page: walletDetails = ', walletDetails);


    return (
        <>

            <Header
                className = "light"
                />

            { props.children }

            <Footer />

        </>
    );
};

export default Page;