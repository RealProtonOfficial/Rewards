import React, { useState, useEffect } from 'react';

import { Link } from "react-router-dom";
import styles from "./Footer.module.sass";
import axios from 'axios';
import { PopUpAlert } from "../../controller/utils";
import SocialIcons from "../SocialIcons";

const menuItems = [
    {
        title: "",
        menu: [
            {
                title: "About Us"
                , url: "/About"
            }
            , {
                title: "News"
                , url: "/news"
            }
            , {
                title: "Contact Us"
                , url: "/contactus"
            }
        ]
    }
];

const legalLinks = [
    {
        title: "Terms & Conditions"
        , url: "/terms-and-conditions"
        , target: '_blank'
    }
    , {
        title: "Privacy Policy"
        , url: "/privacy-policy"
        , target: '_blank'
    }
];

const Footer = () => {

    return (
        <footer
            id = 'realsplit-footer'
            className = { styles.footer }
            >
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
                                                            , color: 'var(--color-gray-white, var(--White, #FFF))'
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
                                                            , color: 'var(--color-gray-white, var(--White, #FFF))'
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

            <div>
                <div
                    //className="container"
                    style = {{
                         display: 'flex'
                        , justifyContent: 'center'
                        , alignItems: 'center'
                        , paddingTop: '20px'
                        , paddingBottom: '20px'
                    }}
                    >
                    {
                        legalLinks.map(legalLink =>
                            {
                                return (
                                    <div
                                        key = { legalLink.url }
                                        className = { styles.title }
                                        style = {{
                                        //    flexGrow: '1'
                                            padding: '0px 17px'
                                        }}
                                        >
                                        <Link
                                            className = { styles.logo }
                                            to = { legalLink.url }
                                            target = { legalLink.target ? legalLink.target : '' }
                                            style = {{
                                                  padding: '5px 0px'
                                                , color: 'var(--color-gray-white, var(--White, #FFF))'
                                                //, fontFamily: 'Source Sans 3'
                                                , fontFamily: '"Poppins", sans-serif'
                                                , fontSize: '18px'
                                                , fontStyle: 'normal'
                                                //, fontWeight: '700'
                                                , lineHeight: '150%'
                                                , characterSpacing: '-1px'
                                            }}
                                            >
                                            { legalLink.title }
                                        </Link>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>

            <div>
                <div
                    style = {{
                        padding: '20px 20px 50px 20px'
                    }}
                    >
                    <div className= { styles.copyright }>
                        Copyright &copy; RealSplit™, 2023
                    </div>
                </div>
            </div>
            
        </footer>
    );
};

export default Footer;
