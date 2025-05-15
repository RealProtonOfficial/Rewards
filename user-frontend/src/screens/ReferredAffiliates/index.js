import React from "react";
import styles from './ReferredAffiliates.module.sass';
import { useHistory, Link } from "react-router-dom";
import AffiliateTable from "./AffiliateTable";
import { NAMES_CONSTANTS } from '../../constants';

const ReferredAffiliates = (props) => {
    console.log('ReferredAffiliates()', props);

    console.log('props.userDetails = ', props.userDetails);
    let userId;
    if (props.userDetails) {
        //userId = userDetail.userId;
        userId = props.userDetails?.id;
        console.log('       userId = ', userId);
    }
    const loginStatus = true;

    return (

        <main className = 'edit-profile'>
            <section
                className = 'form'
                style = {{
                    backgroundColor: "var(--color-gray-100)"
                }}>
                <div className = 'max-width'>

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
                                Referred Affiliates
                            </h1>
                        </div>
                        <div style = {{ paddingLeft: '30px' }}>
                            <img
                                //src = '/images/icons/referrals-icon-28.jpg'
                                src = '/images/icons/referred-affiliates-1.png'
                                alt = 'Referred Affiliates'
                                style = {{
                                    //width: '50px'
                                    height: '70px'
                                    //, filter: 'var(--filter-theme-primary)'
                                }}
                                />
                        </div>
                    </div>

                    <div
                        className = { "subtitle" }
                        >
                        <p>
                            People you have referred to RealSplit using your <Link to="/my-referral-link" style = {{ cursor: "pointer" }}>referral link</Link>.
                        </p>

                        <p>
                            Anyone can be an affiliate (referrer) at RealSplit.
                            Simply share your unique referral link with your contacts and when they sign up, using your link and buy splits you will earn a commission on the fees from their transactions.
                            Furthermore, when the person you referred (your referee) refers others to RealSplit, you will earn a commission on their purchases too.
                            Rewards are earned on up to 3 levels of referral connections.
                        </p>
                    </div>

                    {
                        loginStatus
                        ? <div
                            //className = { styles.wrapper }
                            className = "flex-container"
                            style = {{
                                marginTop: '30px'
                                , justifyContent: 'flex-end'
                            }}
                            >

                            <AffiliateTable
                                //index = { activeIndex }
                                //setActiveIndex = { setActiveIndex }
                                userId = { userId }
                                />

                        </div>
                        
                        : <div style = {{ padding: '20px 0px' }}>
                            <button
                                type = { 'button' }
                                className = 'primary'
                                //onClick = { () => clickLogin() }
                                //onClick={() => history.push('/login')}
                                onClick={() => props.chooseWalletType()}
                                >
                                Login
                            </button>
                             &nbsp;&nbsp;
                             to view Details
                        </div>
                    }

                </div>
            </section>
        </main>
    )
}

export default ReferredAffiliates