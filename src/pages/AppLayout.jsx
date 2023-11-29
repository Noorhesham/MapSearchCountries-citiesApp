import Sidebar from "../components/Sidebar"
import styles from './AppLayout.module.css'
import Map from "../components/Map";
import User from "../components/User";
import Search from "../components/Search";
function AppLayout() {
    //we have this app page and it has nested pages or routes so in order to make it work we defined the routes inside of it as children
    //the sidebar has the 2 nested routes cities and countries
    return (<>
        <Search/>
        <div className={styles.app}>
        <Sidebar/>   
        <Map/>    
        <User/>     
        </div>
        </>
    );
}

export default AppLayout
