import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import {
      PopUpAlert
    , PopUpConfirmation
} from './../../controller/utils';
import { NAMES_CONSTANTS } from '../../constants';
import {
      base_url
} from "../../controller/utils";
import logoImage from '../../assets/images/logo-Placeholder.jpg';

const Header = (props) => {
    console.info('Header()');
    console.debug('Header()', props);

    //const dispatch = useDispatch();
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

    const userAccessToken = localStorage.getItem('USER_ACCESS_TOKEN');
    console.debug('Header: userAccessToken = ', userAccessToken);

    return (

        <>

        <header
            className = { className }
            style = {{
                  width: '100%'
                , margin: 'auto'
                , border: '#E4E4E4 1px solid'
            }}
            >

            <div
                className = { cn(
                      'header-container-desktop'
                    , 'site-max-width'
                )}
                style = {{
                    display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'wrap'
                    , alignItems: 'center'
                    , justifyContent: 'center'
                }}
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

                {
                    userAccessToken
                    ? <div>
                        <ul>
                            <li><Link to = '/my-referral-link'>My Referral Link</Link></li>
                            <li><Link to = '/referred-affiliates'>Referred Affiliates</Link></li>
                            <li><Link to = '/reward-history'>Reward History</Link></li>
                        </ul>

                        <div>
                            <span style = {{ padding: '10px'}}>
                                {
                                    props.userDetails?.email
                                }
                            </span>
                            <button onClick = { e => props.loginRegisterFunctions.logoutUser(e) }>
                                Log Out
                            </button>
                        </div>
                    </div>
                    : <div>
                        <ul>
                            <li><Link to = '/login'>Login</Link></li>
                            <li><Link to = '/register'>Register</Link></li>
                        </ul>
                    </div>
                }

            </div>

        </header>
        </>
    );
};

export default Header;
