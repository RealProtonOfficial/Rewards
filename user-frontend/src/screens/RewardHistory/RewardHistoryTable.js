import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from 'classnames';
import styles from './RewardHistory.module.sass';
import referredAffiliatesStyles from '../ReferredAffiliates/ReferredAffiliates.module.sass';
import { axiosInstance } from "../../utils/API";
import {
    useSelector
} from 'react-redux';
import ReactPaginate from "react-paginate";
import moment from "moment";
import { CircularProgress } from '@mui/material';
import useWindowSize from "../../utils/useWindowSize.js";
import { NAMES_CONSTANTS } from '../../constants';
import { numberWithCommas } from '../../utils/formatPricingNumber';

const RewardHistoryTable = (props) => {

    const dateFormat = 'MMM DD, YYYY';
    const rowsPerPage = 10;

    const [rewardData, setRewardData] = useState([]);
    const [walletDetails, setWalletDetails] = useState(null);
    const [params, setParams] = useState({ limit: 10, page: 1, type: "active" });
    const [count, setCount] = useState(0);
    const { index } = props;
    const [loaderShow, setLoaderShow]=useState(false);
    const [sortValues, setSortValues] = useState("");
    const screenWidth = useWindowSize();

    const getAllAssets = async (index) => {
        console.log('getAllAssets(index)', index);

        setLoaderShow(true);
        console.log('index = ', index);

        let parameters = params;
        switch (index) {
            case 0:
                parameters = { ...params, level: "1" };
                break;
            case 1:
                parameters = { ...params, level: "2" };
                break;
            case 2:
                parameters = { ...params, level: "3" };
                break;
            default:
                break;
        }

        let config = {
            headers: {
                Authorization: "Bearer "+localStorage.getItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN)
            }
            //, params: parameters
        };

        try {

            console.log('sortValues = ', sortValues)
            //if (!sortValues) sortValues = 1;
            let userData = await axiosInstance.get(`/user/rewards/history?level=${ sortValues }`, config);
            console.log('userData = ', userData)
            console.log('userData?.data = ', userData?.data)
            console.log('userData?.data?.result = ', userData?.data?.result)
            console.log('userData?.data?.result?.rows = ', userData?.data?.result?.rows)
            console.log('userData?.data?.result?.walletDetails = ', userData?.data?.result?.walletDetails)
            console.log('userData?.data?.result?.totalPages = ', userData?.data?.result?.totalPages)
            setRewardData(userData?.data?.result?.rows);
            setWalletDetails(userData?.data?.result?.walletDetails)
            setCount(userData?.data?.result?.totalPages);
            setLoaderShow(false);
        } catch (err) {
            setRewardData([]);
            setLoaderShow(false);
        }
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        console.log('getAllAssets({ selected: selectedPage })', selectedPage)
        setParams({ ...params, page: selectedPage + 1 })
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
    };

    useEffect(() => {
        getAllAssets(index);
    }, [props, params, sortValues]);

    /*
    const handleSortValues = (e)=>{
        setSortValues(e.target.value)
    };
    */

    return (
        <>
        <div
            style = {{ flexGrow: 1 }}
            >

            {loaderShow && <div className={styles.loaderContent}><CircularProgress /></div>}

            {/* Temporarily removed Total Commission Received
                walletDetails?.totalBalance.toString() 
                ? <div className="amount-curreny-container">
                    <div className="currency">
                        <img src={`/images/dollar.svg`} alt="dollar" />
                    </div>
                    <div className="amount">
                        <h4>{walletDetails?.totalBalance} USD</h4>  
                        <p>Total Commission Received</p>
                    </div>
                </div>
                : null
            */}

            {/* Temporarily removed Current Reward Balance
                walletDetails?.currentBalance.toString() 
                ? <div className="amount-curreny-container">
                    <div className="currency">
                        <img src={`/images/dollar.svg`} alt="dollar" />
                    </div>
                    <div className="amount">
                        <h4>{walletDetails?.currentBalance} USD</h4>
                        <p>Current Reward Balance</p>
                    </div>
                </div>
                : null
            */}

            {
                rewardData?.length > 0
                &&
                    <>
                    <div className = { referredAffiliatesStyles.affiliateTable }>
                        <table>
                            <thead>
                                <tr>
                                    <th style = {{ borderRadius: "20px 0px 0px 0px" }}>Affiliate</th>
                                    <th>Asset</th>
                                    <th>Level</th>
                                    <th>Purchase Date</th>
                                    {/*
                                    <th>Purchase Time</th>
                                    */}
                                    <th>Amount</th>
                                    <th style = {{ borderRadius: "0px 20px 0px 0px" }}>Commission</th>
                                </tr>
                            </thead>
                            <tbody
                                style = {{
                                    backgroundColor: "#FFF"
                                }}>

                                {
                                    rewardData?.length
                                    ? rewardData.map((el, i) => {
                                        return (
                                            <tr key = { i }>
                                                <td>
                                                    <div>
                                                    {/*
                                                    <img className={cn("mr-5",styles.profileImage)} src={el?.user?.profilePicUrl ? el?.user?.profilePicUrl : "/images/userplaceholder.svg"} alt="Avatar"  />
                                                    {el?.user?.userName || 'NA'}
                                                    */}
                                                    <img
                                                            className = "mr-5"
                                                            src = {el?.user?.profilePicUrl ? el?.user?.profilePicUrl : "/images/userplaceholder.svg"}
                                                            alt="Avatar"
                                                            //style={{ objectFit: "cover", borderRadius: '50%', height:"16px", width:"16px" }}
                                                            //style = {{ paddingRight:"15px" }}
                                                            style = {{ maxWidth: '50px', borderRadius: '25px' }}
                                                            />
                                                    </div>
                                                </td>
                                                <td>
                                                    {el?.assetName || 'NA'}
                                                </td>
                                                <td>
                                                    {el?.level || 'NA'}
                                                </td>
                                                <td>
                                                    {el?.createdAt ? moment(el?.createdAt).format(dateFormat) : "-"}
                                                </td>
                                                {/*
                                                <td>
                                                    {el?.createdAt ? moment(el?.createdAt).format('hh:mm A') : "-"}
                                                </td>
                                                */}
                                                <td>
                                                    {/* "$"+el?.assetAmount.toString() || 'NA' */}
                                                    ${ numberWithCommas(el?.assetAmount.toFixed(2)) }
                                                </td>
                                                <td>
                                                    {/* '$'+el?.commissionAmount.toString() || 'NA' */}
                                                    ${ numberWithCommas(el?.commissionAmount.toFixed(2)) }
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : null
                                }
                            </tbody>
                        </table>

                    </div>

                    <div className={styles.pageWrapper}>
                        {
                            rewardData?.length > rowsPerPage
                            && (
                                <ReactPaginate
                                    previousLabel={"← Previous"}
                                    nextLabel={"Next →"}
                                    pageCount={count}
                                    onPageChange={handlePageClick}
                                    containerClassName={styles.pagination}
                                    previousLinkClassName={styles.pagination__link}
                                    nextLinkClassName={styles.pagination__link}
                                    disabledClassName={styles.pagination__link__disabled}
                                    activeClassName={styles.pagination__link__active}
                                    pageRangeDisplayed={screenWidth < 640 ? 1 : 3}
                                    marginPagesDisplayed={screenWidth < 640 ? 1 : 4}
                                    />
                            )
                        }
                    </div>
                    </>
            }

            {
                rewardData?.length === 0
                && <div
                    //className={styles.info}
                    >
                    You have not earned any referral rewards yet.
                    <br/>Start earning rewards by sharing <Link to = "/my-referral-link">your referral link</Link>.
                </div>
            }

        </div>

        </>
    )
}

export default RewardHistoryTable;