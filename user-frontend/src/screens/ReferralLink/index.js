import React, { useEffect, useState } from 'react';
import {
    Link
} from "react-router-dom";
import cn from "classnames";
//import styles from "./ReferralLink.module.sass";
import { axiosInstance } from '../../utils/API';
import { PopUpAlert } from '../../controller/utils';
import {
    FacebookShareButton
    //, GoogleShareButton
    , LinkedinShareButton
    , TwitterShareButton } from 'react-share';

const ReferralLink = (props) => {
    console.log('ReferralLink()');

    const [referralLink, setReferralLink] = useState('');
    const [copiedShow, setCopiedShow] = useState(false);

    useEffect(()=>{
        generateReferralLink()
    },[]);

    const generateReferralLink = async() => {
        console.log('ReferralLink: generateReferralLink()');

        let config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('USER_ACCESS_TOKEN')
            }
        };

        //await axiosInstance.get('/user/referralLink', config).then((res) => {
        //await axiosInstance.get(`/user/referralLink?email=${props.userDetails.email}`, config).then((res) => {
        await axiosInstance.get(`/user/referralLink/${props.userDetails.email}`, config).then((res) => {
            const referralLink = res?.data?.result;
            setReferralLink(referralLink)
            console.log('referralLink', referralLink);
        }).catch((err) => {
            PopUpAlert('Not Logged In', 'Log in to see your referral link.', 'error').then((res) => {
                document.getElementById('login_button').click();
            })
        });
    };

    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopiedShow(true);
    };

    return (

        <main
            className = 'edit-profile'
            >
            <section
                className = 'form'
                >

                <div
                    className = 'max-width'
                    >

                    <form
                        className = { "max-width" }
                        //onSubmit = { handleSubmit }
                        style = {{ margin: "0px", padding: "0px" }}>

                        <div
                            className = { "heading" }
                            style = {{
                                display: 'flex'
                                , flexDirection: 'row'
                                , flexWrap: 'wrap'
                                //, justifyContent: 'space-between'
                                , justifyContent: 'flex-start'
                            }}>
                            <div style = {{ marginTop: 'auto', marginBottom: 'auto' }}>
                                <h1 style = {{ display: 'inline-block' }}>
                                    Refer & Earn
                                </h1>
                            </div>
                            <div
                                style = {{
                                      paddingLeft: '30px'
                                    , verticalAlign: 'middle'
                                    , marginTop: 'auto'
                                    , marginBottom: 'auto'
                                }}>
                                <img
                                    src = '/images/icons/connected-people-icon.svg'
                                    alt = 'Connected People Icon'
                                    style = {{
                                        height: '70px'
                                        //, maxWidth: '40px'
                                        , verticalAlign: 'middle'
                                        , margin: 'auto'
                                        //, filter: 'unset'
                                    }}
                                    />
                            </div>
                        </div>

                        <div
                            className = 'subtitle'
                            >

                            <p>
                                Share the wealth! Invite your friends to join using your referral link (shown below) and <Link to="/reward-history" style = {{ cursor: "pointer" }}>earn a commission</Link> on the fees from their transactions.
                            </p>

                            <p
                                style = {{
                                    color: 'var(--color-gray-600)'
                                    //, margin: 'auto 50px'
                                }}
                                >
                                Anyone can become an affiliate.
                                Simply share your referral link with your friends and when they sign up, using your referral link, they will be connected to you as a referree and you will earn a percentage of the fees earned from their transactions.
                            </p>
                        </div>


                            <div
                                /*
                                style = {{
                                      display: "flex"
                                    , flexDirection: "row"
                                    , flexWrap: "wrap"
                                    , width: "100%"
                                    , alignItems: "center"
                                    //, padding: '40px'
                                }}
                                */
                                //className = { cn("flex-container", styles.referWrapper) }
                                className = "flex-container refer-wrapper"
                                style = {{ marginTop: '30px' }}
                                >

                                <div
                                    className = "editable"
                                    style = {{
                                          flexGrow: 1
                                        //, flexBasis: "50%"
                                    }}
                                    >
                                    <label
                                        style = {{
                                              fontWeight: "700"
                                            , fontSize: "16px"
                                            , lineHeight: "20px"
                                            , textTransform: "uppercase"
                                            //, color: "#B1B5C4"
                                            , color: "var(--color-gray-600)"
                                            //, paddingBottom: "12px"
                                            , marginBottom: "12px"
                                        }}
                                        >Your Referral Link</label>
                                    <div
                                        //className = { styles.referCopy }
                                        className = 'input-box input-search refer-copy'
                                        style = {{
                                            //margin: "10px"
                                            marginBottom: '20px'
                                        }}
                                        >
                                        <input
                                            type = 'text'
                                            name = 'copy'
                                            value = { referralLink }
                                            disabled
                                            style = {{
                                                fieldSizing: 'content'
                                            //    minWidth: '300px'
                                            //      border: "2px solid #E6E8EC"
                                            //    , borderRadius: "12px"
                                            }}
                                            />
                                    </div>
                                    <div>
                                        <button
                                            type = { 'button' }
                                            //className = { cn("gold", "large") }
                                            className = 'primary'
                                            //className = 'active'
                                            onClick = { () => copyReferralLink() }
                                            >
                                            { copiedShow ? 'Copied' : 'Copy Link' }
                                        </button>
                                    </div>
                                </div>

                                <div
                                    style = {{
                                        flexGrow: 1
                                        //, flexBasis: "50%"
                                        , padding: '40px 0px'
                                    }}
                                    >
                                    <div
                                        //className = { styles.referSocial }
                                        className = 'refer-social'
                                        >
                                        <div
                                            //className = { styles.icon }
                                            className = 'icon'
                                            >
                                            <FacebookShareButton url = { referralLink }>
                                                <img
                                                    src = { '/images/icons/Facebook-icon-svg.svg' }
                                                    alt="facebook"
                                                    style = {{ width: '36px' }}
                                                    />
                                            </FacebookShareButton>
                                        </div>
                                        {/*
                                        <div className = { styles.icon }>
                                            <GoogleShareButton url = { referralLink }>
                                                <img src = { '/images/icons/Google-icon-svg.svg' } alt="google"/>
                                            </GoogleShareButton>
                                        </div>
                                        */}
                                        <div
                                            //className = { styles.icon }
                                            className = 'icon'
                                            url = { referralLink }
                                            >
                                            <TwitterShareButton url = { referralLink }>
                                                {/*
                                                <img src = { '/images/twitterRefer.png' } alt="twitter"/>
                                                */}
                                                <img
                                                    //src = { '/images/icons/Twitter-icon-svg.svg' }
                                                    src = { '/images/icons/X_logo_2023_original.svg' }
                                                    alt="twitter" />
                                            </TwitterShareButton>
                                        </div>
                                        <div
                                            //className = { styles.icon }
                                            className = 'icon'
                                            >
                                            <LinkedinShareButton url = { referralLink }>
                                                <img src = { '/images/icons/LinkedIn-icon-svg.svg' } alt="linkedin" />
                                            </LinkedinShareButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </form>

                </div>
            </section>
        </main>
    );
};

export default ReferralLink;
