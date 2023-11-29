import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav"
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const navigate=useNavigate()
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const {login,isAuthenticated,err}=useAuth()
  function handleSubmit(e){
    e.preventDefault()
    if(email&&password) login(email,password)
  }
  useEffect(function(){
    if(isAuthenticated) navigate('/app',{replace:true})//it replaced the login page with the app in the call stack cause 
                                                      //the login redirects to app when i is authenticated is true
  },[isAuthenticated,navigate])
  return (
    <main className={styles.login}>
            <PageNav/>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>{err?<Message message={err} type='red' />:''}</div>
        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
