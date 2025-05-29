import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";
import styles from "./Footer.module.sass";

const menuItems = [
    {
        title: "",
        menu: [
            {
                title: "Login"
                , url: "/login"
            }
            ,{
                title: "Register"
                , url: "/register"
            }
        ]
    }
];

const Footer = () => {

    return (
        <footer
            id = 'footer'
            //className = { styles.footer }
            style = {{
                border: 'blue 1px solid'
            }}
            >

            Footer
            <div
                style = {{
                    padding: '0px 0px 0px 0px'
                    , maxWidth: '1500px'
                    , textAlign: 'center'
                    , margin: 'auto'
                }}
                >

                <div
                    //className = {styles.row}
                    className = 'container'
                    style = {{
                          display: 'flex'
                        , flexWrap: 'wrap'
                        , justifyContent: 'space-around'
                        , marginLeft: '30px'
                        , marginRight: '30px'
                    }}>

                    <div
                        className = 'footer-links'
                        style = {{
                              display: 'flex'
                            , flexWrap: 'wrap'
                            , gap: '24px'
                            , justifyContent: 'space-around'
                            , alignItems: 'center'
                            , paddingTop: '40px'
                            , paddingBottom: '20px'
                            , margin: 'auto'
                            , flex: 'auto'
                        }}
                        >
                        {
                            menuItems[0].menu.map(menuItem =>
                                {
                                    return (
                                        <div
                                            //key = { menuItem.url }
                                            key = { menuItem.title }
                                            className = { styles.title }
                                            style = {{
                                                flexGrow: '1'
                                            }}>
                                            {
                                                menuItem.externalLink
                                                ?
                                                    <a
                                                        href = { menuItem.externalLink }
                                                        target = '_blank'
                                                        style = {{
                                                              padding: '5px 0px'
                                                            //, color: 'var(--color-gray-white, var(--White, #FFF))'
                                                            //, fontFamily: 'Source Sans 3'
                                                            , fontFamily: '"Poppins", sans-serif'
                                                            , fontSize: '20px'
                                                            , fontStyle: 'normal'
                                                            //, fontWeight: '700'
                                                            , lineHeight: '150%'
                                                        }}
                                                        >{ menuItem.title }</a>
                                                :
                                                    <Link
                                                        className = { styles.logo }
                                                        to = { menuItem.url }
                                                        style = {{
                                                              padding: '5px 0px'
                                                            //, color: 'var(--color-gray-white, var(--White, #FFF))'
                                                            //, fontFamily: 'Source Sans 3'
                                                            , fontFamily: '"Poppins", sans-serif'
                                                            , fontSize: '20px'
                                                            , fontStyle: 'normal'
                                                            //, fontWeight: '700'
                                                            , lineHeight: '150%'
                                                        }}>
                                                        { menuItem.title }
                                                    </Link>
                                            }
                                        </div>
                                    )
                                }
                            )
                        }

                    </div>

                </div>
            </div>

        </footer>
    );
};

export default Footer;
