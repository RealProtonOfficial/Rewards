import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cn from 'classnames';
import styles from './ReferredAffiliates.module.sass';
import { axiosInstance } from "../../utils/API";
import {
    useSelector
    //, useDispatch
} from 'react-redux';
import ReactPaginate from "react-paginate";
import moment from "moment";
import { CircularProgress } from '@mui/material';
import { NAMES_CONSTANTS } from '../../constants';
import { PopUpAlert } from "../../controller/utils";

const AffiliateTable = (props) => {
//const AffiliateTable = () => {
    console.log("AffiliateTable(props)", props)

    const dateFormat = 'MMM DD, YYYY';
    const dateTimeFormat = 'DD/MM/YYYY hh:mm A';

    const rowsPerPage = 10;
    const [affiliates, setAffiliates] = useState([]);
    const [params, setParams] = useState({ limit: rowsPerPage, page: 1, type: "active" });
    const [count, setCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const getAllAssets = async (index) => {
        console.log('getAllAssets(index)', index);

        let parameters = params;
        let config = {
            headers: {
                Authorization: "Bearer "+localStorage.getItem(NAMES_CONSTANTS.USER_ACCESS_TOKEN),
            }
        };

        if (index) {
            //let parameters = params;
            switch (index) {
                case 0:
                    break;
                case 1:
                    parameters = { ...params, level: "1" };
                    break;
                case 2:
                    parameters = { ...params, level: "2" };
                    break;
                case 3:
                    parameters = { ...params, level: "3" };
                    break;
                default:
                    break;
            }
        }

        parameters.userId = props.userDetails?.userId;
        parameters.email = props.userDetails?.email;
        console.log('parameters = ', parameters);

        config.params = parameters;
        console.log('config = ', config);
        
        try {
            let userData = await axiosInstance.get("/user/affiliates", config);
            //let userData = await axiosInstance.get(`/user/affiliates/${props.userDetails.email}`, config);
            console.log('userData', userData);
            console.log('userData?.data', userData?.data);
            console.log('userData?.data?.result', userData?.data?.result);
            console.log('userData?.data?.result?.rows', userData?.data?.result?.rows);
            console.log('userData?.data?.result?.totalPages', userData?.data?.result?.totalPages);
            setAffiliates(userData?.data?.result?.rows);
            setCount(userData?.data?.result?.totalPages);
        } catch (err) {

            console.log(err);

            setAffiliates([]);

            if (err.response.data) {
                PopUpAlert(
                      err.response.data.message
                    , err.response.data.error
                    , 'error'
                );
            }
        }
    };
    
    useEffect(() => {
        console.info("AffiliateTable: useEffect()")
        let doc =document.getElementById("tableContainer")
        if (doc) doc.scrollLeft = 0
    //},[index]);
    }, [activeIndex]);

    const handlePageClick = ({ selected: selectedPage }) => {
        console.log('AffiliateTable: handlePageClick('+selectedPage+')');
        //console.log(selectedPage, "hello");
        setParams({ ...params, page: selectedPage + 1 })
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
    };

    //const routeTo = (x) => { alert("routeTo("+x+")"); };

    useEffect(() => {
        console.info("AffiliateTable: useEffect(() => {")

        //getAllAssets(index);
        getAllAssets(activeIndex);
    //}, [props, params]);

    }, [activeIndex, params]);

    let affiliateLevels = [
          "All Levels"
        , "Level 1"
        , "Level 2"
        , "Level 3"
    ];

    /*
    let affiliateLevelsNew = [
          [ "All" ]
        , [ "Level 1", 1]
        , [ "Level 2", 2]
        , [ "Level 3", 3]
    ];
    */

    return (

        <>
        {/*
        <div
            //style = {{ padding: "10px 0px", margin: "auto", minHeight:"32vh" }}
            style = {{ flexGrow: 1 }}
            >
        */}

            <div style = {{ display: 'inline-block' }}>
                <div
                    //className = { styles.nav }
                    className = { 'nav' }
                    >
                    {
                        affiliateLevels.map((affiliateLevel, index) => (
                            <button
                                className = {
                                    cn(
                                          'primary-inverse'
                                        //, 'rounded'
                                        , 'circular'
                                        , 'medium'
                                        , { ['active']: index === activeIndex }
                                    )
                                }
                                //className = { 'primary-inverse rounded medium' }
                                onClick = { () => setActiveIndex(index) }
                                //onClick = { () => props.setActiveIndex(index) }
                                key = { index }
                                >
                                { affiliateLevel }
                            </button>
                        ))
                    }
                </div>
            </div>

            {
                affiliates?.length !== 0
                //affiliates?.length === 0 // for testing/development
                &&
                    <>
                    <div
                        //className={styles.affiliateTable}
                        className = { cn('table-container', styles.affiliateTable) }
                        id="tableContainer"
                        style = {{ overflow: 'auto' }}
                        >
                        <table>

                            <thead>
                                <tr>
                                    {/*
                                    <th className={ cn(styles.start, "start") }>Affiliate Name</th>
                                    <th>Email</th>
                                    <th>Level</th>
                                    <th className={ styles.end }>Date Joined</th>
                                    <th></th>
                                    <th>Affiliate Name</th>
                                    */}
                                    <th>Affiliate</th>
                                    <th>Affiliate Name</th>
                                    <th style = {{ textAlign: 'center' }}>Level</th>
                                    <th>Date Joined</th>
                                </tr>
                            </thead>

                            <tbody>

                                {/*
                                <tr key = { 0 }>
                                    <td className={ styles.start }>
                                        <div>
                                            <img
                                                className = "mr-5"
                                                src = "/images/userplaceholder.svg"
                                                alt = "Avatar"
                                                //style={{ objectFit: "cover", borderRadius: '50%', height:"16px", width:"16px" }}
                                                style = {{ paddingRight:"15px" }}
                                                />
                                            { 'NA' }
                                        </div>
                                    </td>
                                    <td>
                                        { 'NA' }
                                    </td>
                                    <td>
                                        <span>{ 'NA' }</span>
                                    </td>
                                    <td className={ styles.end }>
                                        { 'DD/MM/YYYY hh:mm A' }
                                    </td>
                                </tr>
                                */}

                                {
                                    affiliates?.length
                                    ? affiliates.map((el, i) => {
                                        return (
                                            <tr key = {i}>

                                                <td className={ styles.start }>
                                                    <div>
                                                        <img
                                                            className = "mr-5"
                                                            src = {el?.user?.profilePicUrl ? el?.user?.profilePicUrl : "/images/userplaceholder.svg"}
                                                            alt="Avatar"
                                                            //style={{ objectFit: "cover", borderRadius: '50%', height:"16px", width:"16px" }}
                                                            //style = {{ paddingRight:"15px" }}
                                                            style = {{ maxWidth: '50px', borderRadius: '25px' }}
                                                            />
                                                        {/*
                                                        {el?.user?.userName || 'NA'}
                                                        */}
                                                    </div>
                                                </td>

                                                <td>
                                                    { el?.user?.email || 'NA' }
                                                </td>

                                                <td style = {{ textAlign: 'center' }}>
                                                    {/*
                                                    <span>{ el?.user?.walletId || 'NA' }</span>
                                                    */}
                                                    {
                                                        props.userId === el?.rLevel1
                                                        ? 1
                                                        : props.userId === el?.rLevel2
                                                            ? 2
                                                            : props.userId === el?.rLevel3
                                                                ? 3
                                                                : 0
                                                    }
                                                </td>

                                                <td>
                                                    { el?.user?.createdAt ? moment(el?.user?.createdAt).format(dateFormat) : "-"}
                                                </td>

                                                {/*
                                                <td>
                                                    <div className={styles.flexCenter}>
                                                        <svg viewBox="0 0 24 24" width="30px" height="30px" fill="#777E90">
                                                            <path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z" />
                                                        </svg>
                                                    </div>
                                                </td>
                                                */}

                                            </tr>
                                        )
                                    })
                                    : null
                                }
                            </tbody>
                        </table>
                    </div>

                    {
                        affiliates?.length > rowsPerPage
                        && (<ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            pageCount={count}
                            onPageChange={handlePageClick}
                            containerClassName={styles.pagination}
                            previousLinkClassName={styles.pagination__link}
                            nextLinkClassName={styles.pagination__link}
                            disabledClassName={styles.pagination__link__disabled}
                            activeClassName={styles.pagination__link__active}
                        />)
                    }

                    </>
            }

            {
                affiliates?.length === 0
                && 
                    <div
                        className={styles.info}
                        style = {{
                            textAlign: 'left'
                            , fontSize: 'unset'
                            , width: '100%'
                        }}
                        >
                        You do not have any referred affiliates at this level.
                        {/*
                        <br/><Link to = "/my-referral-link">Share your referral link</Link>
                        */}
                    </div>
            }

        {/*
        </div>
        */}
        </>
    )
};

export default AffiliateTable;