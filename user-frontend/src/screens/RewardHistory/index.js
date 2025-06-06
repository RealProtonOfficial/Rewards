import React, {
    useState
    //, useEffect
} from "react";
//import styles from './RewardHistory.module.sass';
//import cn from "classnames";
import { useSelector } from 'react-redux';
import { useHistory, Link } from "react-router-dom";
import RewardHistoryTable from "./RewardHistoryTable";

const RewardHistory = (props) => {
    console.log('RewardHistory()', props);

    //const history = useHistory()
    const [activeIndex, setActiveIndex] = useState(null);

    return (

        <main className = 'edit-profile'>
            <section
                className = 'form'
                style = {{
                    backgroundColor: "var(--color-gray-100)"
                }}
                >
                <div className = 'max-width'>


                    {/* Temporarily removed Back Button
                    <div
                        style = {{
                            paddingBottom: "30px"
                        }}>

                        <button
                            type = "button"
                            className = { cn("rounded-clear", "light") }
                            //onClick = { handleClickBackButton }
                            //onClick = { () => history.push("/my-assets") }
                            style = {{
                                  padding: "10px 15px"
                                , border: "2px solid #E6E8EC"
                            }}>
                            <div className = { "table" }>
                                <div className = { "cell" }><img src="images/icons/left-arrow-icon.png" style = {{ verticalAlign: "middle" }} /></div>
                                <div className = { "cell" } style = {{ verticalAlign: "middle", paddingLeft: "15px" }}>Back to Profile</div>
                            </div>
                        </button>

                    </div>
                    */}

                    <div
                        className = { "heading" }
                        style = {{
                            display: 'flex'
                            , flexDirection: 'row'
                            , flexWrap: 'wrap'
                            , justifyContent: 'flex-start'
                        }}>
                        <div style = {{ marginTop: 'auto', marginBottom: 'auto' }}>
                            <h1 style = {{ display: 'inline-block' }}>
                                Reward History
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
                                src = '/images/icons/earn-money-scratch.svg'
                                alt = 'Earn Money Icon'
                                style = {{
                                      height: '70px'
                                    , verticalAlign: 'middle'
                                    , margin: 'auto'
                                }}
                                />
                        </div>
                    </div>

                    <div
                        className = { "subtitle" }
                        >
                        Rewards earned from your <Link to="/referred-affiliates" style = {{ cursor: "pointer" }}>referred affiliates</Link> transactions.
                    </div>

                    <div
                        className = "flex-container"
                        style = {{ marginTop: '30px' }}
                        >
                        <RewardHistoryTable
                            index = { activeIndex }
                            userDetails = { props.userDetails }
                            />
                    </div>

                </div>
            </section>
        </main>
    )
}

export default RewardHistory