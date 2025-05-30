import { useNavigate, Link } from "react-router-dom";

const UserHome = props => {
    console.info('screens/UserHome(props)', props);

    const navigate = useNavigate()

    return (
        
        <main
            className = 'item-main'
            >
            <section
                className = 'theme theme-light'
                style = {{
                    paddingTop: "0px"
                    , paddingBottom: "80px"
                }}
                >
                <div
                    className = { 'max-width' }
                    style = {{ paddingLeft: '0px', paddingRight: '0px' }}
                    >
                    <div
                        //className = 'flex-container'
                        style = {{
                            width: '100%'
                            , maxWidth: "440px"
                            , margin: 'auto'
                        }}
                        >
                        <h1>User Home</h1>

                        <div>
                            <ul>
                                <li><Link to = '/my-referral-link'>My Referral Link</Link></li>
                                <li><Link to = '/referred-affiliates'>Referred Affiliates</Link></li>
                                <li><Link to = '/reward-history'>Reward History</Link></li>
                            </ul>
                        </div>
                        <div>
                            <button
                                onClick = { e => props.loginRegisterFunctions.logoutUser(e) }
                                >
                                Log Out
                            </button>
                        </div>
                        
                    </div>
                </div>
            </section>

        </main>
        
    );
};

export default UserHome;
