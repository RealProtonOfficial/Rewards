import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Header.module.sass';
import './style.scss';
import UserHeader from './UserHeader';
import { decrement } from '../../redux/counterSlice';
import { countCart } from '../../redux/cartSlice';
import {
      PopUpAlert
    , PopUpConfirmation
} from './../../controller/utils';

// Temporarily remove notificationn pending new React Query (post React 19) upgrade.
/*
//import Notifications from './Notifications';
import NotificationsButton from './Notifications/NotificationsButton.js';
//import MobileUserHeader from './MobileUserHeader';
*/
import { NAMES_CONSTANTS } from '../../constants';
import { setUser } from '../../redux/userSlice';
import { searchAssets, clearSearchAssets } from '../../redux/assetSlice';

import {
      base_url
} from "../../controller/utils";

import logoImage from '../../assets/images/logo/Realsplit_logo_WHITE_HANDS.png';

const Header = (props) => {
    console.info('Header()');
    console.debug('Header()', props);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [className, setClassName] = useState(props.className ? props.className : 'light');

    // Dynamic variables for the header images
    const [logoImageSrc, setLogoImageSrc] = React.useState(logoImage);

    const scrollToTop = () => {
        console.debug('Header.scrollToTop()');
        window.scrollTo({
              top: 0
            , behavior: 'smooth'
        });
    };

    return (

        <>
        {
            loaderStatus
            && (
                <div className={styles.LoaderBg}>
                    <CircularProgress style={{ color: '#ffffff' }} />
                </div>
            )
        }

        <header
            className = { className }
            style = {{
                  position: 'fixed'
                , zIndex: 2
                , width: '100%'
                , margin: 'auto'
            }}>

            <div
                className = { cn(
                      'header-container-desktop'
                    , styles.headerContainerDesktop
                    , 'site-max-width'
                )}
                >

                <div
                    className = { 'logo-container' }
                    >
                    <div
                        className = { "logo-image" }
                        style = {{ marginLeft: '0px' }}
                        >
                        <Link
                            to='/' style={{ cursor: 'pointer' }}
                            onClick = { (e) => scrollToTop() }
                            >
                            <img
                                src = { logoImageSrc }
                                style = {{
                                    verticalAlign: 'bottom'
                                }} />
                        </Link>
                    </div>
                </div>

            </div>

        </header>
        </>
    );
};

export default Header;
