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

    return (

        <>

        <header
            className = { className }
            style = {{
                  width: '100%'
                , margin: 'auto'
                , border: 'blue 1px solid'
            }}
            >

            Header
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

                <div>
                    <ul>
                        <li><Link to = '/login'>Login</Link></li>
                        <li><Link to = '/register'>Register</Link></li>
                    </ul>
                </div>

            </div>

        </header>
        </>
    );
};

export default Header;
