import { Outlet } from "react-router-dom"
import AppNav from "./AppNav"
import Footer from "./Footer"
import Logo from "./Logo"
import styles from './Sidebar.module.css'
function Sidebar() {
    //the outlet here is going to place the nested routes based on the path
    return (
        <div className={styles.sidebar}>
            <Logo/> 
            <AppNav/>
            <Outlet/>
          <Footer/>
        </div>
    )
}

export default Sidebar