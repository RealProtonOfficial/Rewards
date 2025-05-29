import { Link, useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    return (
        <>
        <main className = 'home'>
            <section
                //className={styles.aboutsection}
                //className = 'home'
                //className = 'form'
                //style = {{
                //    paddingTop: "0px"
                //    , paddingBottom: "80px"
                //}}
                >
                <div className = { 'max-width' }>
                    <div
                        //className = 'flex-container'
                        //className = { 'property-information' }
                        //style = {{ textAlign: "left" }}
                        >
                        
                        <ul>
                            <li><Link to = '/login'>Login</Link></li>
                            <li><Link to = '/register'>Register</Link></li>
                        </ul>
                        
                    </div>
                </div>
            </section>

        </main>
        </>
    );
};

export default Home;
